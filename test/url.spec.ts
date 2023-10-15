import { FastCsvParse } from "../lib";
import { describe } from "node:test";
import { test } from "mocha";
import assert from "assert";

const fileUrl =
  "https://datos.santafe.gob.ar/dataset/86eb088e-b156-4eb1-9f16-33338aaabc03/resource/91d5162b-7851-47bb-9050-1146c4418d8c/download/municipalidades-y-comunas.csv";

describe("test [FastCsv] basic test", function () {
  test("it must download and parse the file correctly", async function () {
    const fastCsv = await FastCsvParse({ url: fileUrl });

    assert(fastCsv.getRows().length > 0, "it must be greater than zero");
  });
});
