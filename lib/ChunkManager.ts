import readline from "readline";
import { Readable } from "stream";
import { ColumnValueType } from "./types";
import { removeQuotes } from "./utils/index.utils";

const checkRow = (row: string[], columns: ColumnValueType[]) => {
  for (const index in row) {
    switch (columns[index]) {
      case ColumnValueType.number: {
        if (isNaN(Number(row[index]))) {
          return false;
        }

        break;
      }

      case ColumnValueType.string: {
        if (typeof row[index] !== "string") {
          return false;
        }
        break;
      }
      case ColumnValueType.boolean: {
        if (typeof row[index] !== "boolean") {
          return false;
        }
      }
    }
  }
  return true;
};

export type ChunkValues = {
  columns: string[];
  rows: string[];
  invalid: string[];
};

export class ChunkManager {
  public async read(
    input: Readable,
    columnsFilters?: ColumnValueType[],
  ): Promise<ChunkValues> {
    const response: ChunkValues = {
      columns: [],
      rows: [],
      invalid: [],
    };

    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input,
      });

      let isFirst = true;

      if (columnsFilters) {
        rl.on("line", (line) => {
          const row = removeQuotes(line).split(",");

          if (isFirst) {
            isFirst = !isFirst;
            response.columns = row;
            return;
          }

          if (checkRow(row, columnsFilters)) {
            response.rows.push(line);
          } else {
            response.invalid.push(line);
          }
        });
      } else {
        rl.on("line", (line) => {
          if (isFirst) {
            isFirst = !isFirst;
            response.columns = removeQuotes(line).split(",");
            return;
          }
          response.rows.push(line);
        });
      }

      rl.on("close", () => {
        resolve(response);
      });

      rl.on("error", (err: unknown) => {
        reject(err);
      });
    });
  }
}
