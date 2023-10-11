import fs from "fs";
import {
  BREAK_LINE,
  BUFFER_ENCONDING,
  BUFFER_SIZE,
  CSV_CONTENT_TYPE,
  removeQuotes,
  sanitizeString,
} from "./utils/index.utils";
import https from "https";
import streamToArray from "stream-to-array";
import { Readable } from "stream";
import { ERROR_CODES } from "./utils/errors.utils";

type DefaultValues = {
  chunkSize?: number;
  filepath?: string;
  url?: string;
};

const download = (url: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          console.error(
            `error trying to download the file statusCode: ${response.statusCode} message: ${response.statusMessage}`,
          );
          reject(new Error(ERROR_CODES.DOWNLOADING));
          return;
        }

        if (response.headers?.["content-type"] !== CSV_CONTENT_TYPE) {
          reject(new Error(ERROR_CODES.CONTENT_TYPE));
        }

        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const dataChunks: any = [];
        response.on("data", (chunk) => {
          dataChunks.push(chunk);
        });

        response.on("end", () => {
          resolve(dataChunks);
        });

        response.on("error", (error) => {
          reject(error);
        });
      })
      .on("error", (error) => {
        console.error("Unkown error", error);
        reject(new Error(ERROR_CODES.UNKNOWN));
      });
  });
};

export default class FastCSV {
  private props: DefaultValues = {
    chunkSize: BUFFER_SIZE,
  };

  private columns: string[] = [];
  private response: string[] = [];

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private content: any;

  constructor(values?: DefaultValues) {
    this.props = { ...values };
  }

  public getColumns() {
    return this.columns;
  }

  private setColumns(row: string) {
    this.columns = removeQuotes(row).split(",");
  }

  private async build() {
    let isFirst = true;

    for await (const chunk of this.processCSV(this.content)) {
      if (isFirst) {
        this.setColumns(chunk);
        isFirst = !isFirst;
      }

      this.response.push(chunk.toString("utf-8"));
    }

    return this;
  }

  private async *processCSV(fileStream: Readable) {
    let remanentChunk = null;

    for await (const chunk of fileStream) {

      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const data: any = remanentChunk
        ? Buffer.concat([remanentChunk, chunk])
        : chunk;
      let startIndex = 0;
      let endIndex;

      while ((endIndex = data.indexOf(BREAK_LINE, startIndex)) !== -1) {
        const linea = sanitizeString(
          data.slice(startIndex, endIndex).toString(BUFFER_ENCONDING),
        );

        startIndex = endIndex + 1;

        yield linea;
      }

      remanentChunk = data.slice(startIndex);
    }

    if (remanentChunk && remanentChunk.length > 0) {
      yield remanentChunk.toString(BUFFER_ENCONDING);
    }
  }

  private async fromPath() {
    if (this.props.filepath === undefined) {
      return;
    }

    console.info("[FastCsv] -- getting content from file", this.props.filepath);

    const stream = fs.createReadStream(this.props.filepath);
    this.content = await streamToArray(stream);

    return await this.build();
  }

  private async fromURL() {
    if (this.props.url === undefined) {
      return;
    }

    console.info("[FastCsv] -- getting content from url", this.props.url);

    const chunks = await download(this.props.url);
    this.content = chunks;

    return await this.build();
  }

  public async process() {
    await this.fromURL();
    await this.fromPath();

    return this;
  }

  public getRows() {
    return this.response;
  }
}

export const FastCsvParse = async (values?: DefaultValues) => {
  if (values?.filepath !== undefined && values.url !== undefined) {
    throw new Error(ERROR_CODES.MULTIPLE_PARAMS);
  }

  if (values?.filepath === undefined && values?.url === undefined) {
    throw new Error(ERROR_CODES.DATASOURCE_IS_MISSING);
  }

  const fast = new FastCSV(values);
  return await fast.process();
};
