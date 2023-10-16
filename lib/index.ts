import fs from "fs";
import { BUFFER_SIZE, columnHeaderValidator } from "./utils/index.utils";
import https from "https";
import { Readable } from "stream";
import { ERROR_CODES } from "./utils/errors.utils";
import { ChunkManager } from "./ChunkManager";
import { ColumnType } from "./types";

type DefaultValues = {
  chunkSize?: number;
  filepath?: string;
  url?: string;
  columns?: ColumnType[];
  isFormat?: () => void;
};

export default class FastCSV {
  private props: DefaultValues = {
    chunkSize: BUFFER_SIZE,
  };

  private columns: string[] = [];
  private response: string[] = [];

  /**
   * invalid rows, if the row doesn't match with the columns filters this will be added in this array.
   */
  private invalid: string[] = [];

  constructor(values?: DefaultValues) {
    this.props = { ...values };
  }

  public getColumns() {
    return this.columns;
  }

  private setColumns(row: string[]) {
    this.columns = row;

    if (typeof this.props.columns === "undefined") return;

    if (!columnHeaderValidator(this.props.columns, this.columns))
      throw new Error(ERROR_CODES.COLUMNS_INVALID);
  }

  private async build(inputReadable: Readable) {
    const chunkM = new ChunkManager();

    let validation;
    if (typeof this.props.columns !== "undefined") {
      validation = this.props.columns.map((k: ColumnType) => k.value);
    }

    const { columns, rows, invalid } = await chunkM.read(
      inputReadable,
      validation,
    );

    if (columns) {
      this.setColumns(columns);
    }

    this.response = rows;

    this.invalid = invalid;

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

  public getInvalidRows() {
    return this.invalid;
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
