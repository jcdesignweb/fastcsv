import { FastCsvParse } from "../lib";
import { describe } from "node:test";
import { test } from "mocha";
import assert from "assert";
import { ERROR_CODES } from "../lib/utils/errors.utils";

const fileUrl =
  "https://datos.santafe.gob.ar/dataset/86eb088e-b156-4eb1-9f16-33338aaabc03/resource/91d5162b-7851-47bb-9050-1146c4418d8c/download/municipalidades-y-comunas.csv";

const filepath = __dirname + "/fixture/municipalidades-sf-short.csv";

describe("test [FastCsv] basic test", function () {
  test("it must parse the file correctly", async function () {
    const fastCsv = await FastCsvParse({ filepath: filepath });

    assert(fastCsv.getColumns().length === 14, "it must have 8 columns");
    assert(fastCsv.getRows().length > 0, "it must be greater than zero");
  });

  test("it must download and parse the file correctly", async function () {
    const fastCsv = await FastCsvParse({ url: fileUrl });

    assert(fastCsv.getRows().length > 0, "it must be greater than zero");
  });

  test("it must fails a cause of MULTIPLE_PARAMS set", async function () {
    try {
      await FastCsvParse({ url: fileUrl, filepath });
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
});
