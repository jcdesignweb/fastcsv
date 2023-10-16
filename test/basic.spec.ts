import { FastCsvParse } from "../lib";
import { describe } from "node:test";
import { test } from "mocha";
import assert from "assert";
import { ERROR_CODES } from "../lib/utils/errors.utils";
import { ColumnType, ColumnValueType } from "../lib/types";

const filepath = __dirname + "/fixture/municipalidades-sf-short.csv";

describe("test [FastCsv] basic test", function () {
  test("it must parse the file correctly", async function () {
    const fastCsv = await FastCsvParse({ filepath: filepath });

    assert(fastCsv.getColumns().length === 4, "it must have 4 columns");
    assert(fastCsv.getRows().length > 0, "it must be greater than zero");
  });

  test("it must fails a cause of MULTIPLE_PARAMS set", async function () {
    try {
      await FastCsvParse({ url: "some-url.com", filepath });
    } catch (e: unknown) {
      if (e instanceof Error) {
        assert(
          e.message == ERROR_CODES.MULTIPLE_PARAMS,
          "it fails a cause of MULTIPLE_PARAMS",
        );
      }
    }
  });

  test("it must fails a cause of DATASOURCE_IS_MISSING", async function () {
    try {
      await FastCsvParse();
    } catch (e: unknown) {
      if (e instanceof Error) {
        assert(
          e.message == ERROR_CODES.DATASOURCE_IS_MISSING,
          "it fails a cause of DATASOURCE_IS_MISSING",
        );
      }
    }
  });

  test("it must validate columns names", async function () {
    const columns: ColumnType[] = [
      { key: "distrito_id", value: ColumnValueType.number },
      { key: "distrito_nombre", value: ColumnValueType.string },
      { key: "region", value: ColumnValueType.number },
      { key: "nodo", value: ColumnValueType.string },
    ];

    const fastCsv = await FastCsvParse({ filepath, columns });
    assert(fastCsv.getRows().length === 9);
  });

  test("it must return invalid rows", async function () {
    const columns: ColumnType[] = [
      { key: "distrito_id", value: ColumnValueType.number },
      { key: "distrito_nombre", value: ColumnValueType.string },
      { key: "region", value: ColumnValueType.number },
      { key: "nodo", value: ColumnValueType.number }, // wrong filter
    ];

    const fastCsv = await FastCsvParse({ filepath, columns });

    assert(fastCsv.getInvalidRows().length > 0);
  });
});
