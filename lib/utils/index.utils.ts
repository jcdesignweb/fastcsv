import { ColumnType } from "../types";

export const CSV_CONTENT_TYPE = "text/csv";
export const BUFFER_SIZE = 128 * 1024; // 128 KiB
export const BREAK_LINE = "\n";
export const BUFFER_ENCONDING = "utf-8" as BufferEncoding;

const isValidUrl = (value: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i",
  );
  return !!urlPattern.test(value);
};

const columnHeaderValidator = (
  columnsTypes: ColumnType[],
  columns: string[],
): boolean => {
  if (columnsTypes.length !== columns.length) return false;

  for (let i = 0; i < columns.length; i++) {
    if (columns[i] !== columnsTypes[i]?.key) {
      return false;
    }
  }

  return true;
};

const sanitizeString = (str: string) =>
  str.replace(/(\r+)|(^\n+)|(\n{2,})|(\n+$)/g, "");

const removeQuotes = (str: string) => str.replace(/['"]+/g, "");

export { isValidUrl, sanitizeString, removeQuotes, columnHeaderValidator };
