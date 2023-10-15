import fs from "fs";
import { BUFFER_SIZE, removeQuotes } from "./utils/index.utils";
import https from "https";
import { Readable } from "stream";
import { ERROR_CODES } from "./utils/errors.utils";
import { ChunkManager } from "./ChunkManager";

type DefaultValues = {
  chunkSize?: number;
  filepath?: string;
  url?: string;
};

export default class FastCSV {
  private props: DefaultValues = {
    chunkSize: BUFFER_SIZE,
  };

  private columns: string[] = [];
  private response: string[] = [];

  constructor(values?: DefaultValues) {
    this.props = { ...values };
  }

  public getColumns() {
    return this.columns;
  }

  private setColumns(row: string) {
    this.columns = removeQuotes(row).split(",");
  }

  private async build(inputReadable: Readable) {
    const chunkM = new ChunkManager();
    const chunks = await chunkM.read(inputReadable);

    if (chunks[0]) {
      this.setColumns(chunks[0]);
    }

    this.response = chunks;

    return this;
  }

  private async fromPath(filepath: string) {
    console.info("[FastCsv] -- getting content from file", this.props.filepath);

    const stream = fs.createReadStream(filepath);

    return await this.build(stream);
  }

  private async fromURL(url: string) {
    console.info("[FastCsv] -- getting content from url", url);

    const response: Readable = await new Promise((resolve, reject) => {
      const req = https.get(url, resolve);
      req.on("error", reject);
    });

    return await this.build(response);
  }

  public async process() {
    if (this.props.url !== undefined) {
      return await this.fromURL(this.props.url);
    }

    if (this.props.filepath !== undefined) {
      return await this.fromPath(this.props.filepath);
    }

    console.warn("No method found - verify params");

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
  const result = await fast.process();

  return result;
};
