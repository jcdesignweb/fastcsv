import { FastCsvParse } from "../lib";
import { describe } from "node:test";
import { test } from "mocha";
import { ColumnType, ColumnValueType } from "../lib/types";
import { assert } from "node:console";
import fs from "node:fs";

/**
 * this file it's too big, I cannot be uploaded into GitHub.
 */
const bigFile = __dirname + "/fixture/municipalidades-sf-big.csv";

// for github building tests
const shortFile = __dirname + "/fixture/municipalidades-sf-short.csv";

const filepath = !fs.existsSync(bigFile) ? bigFile : shortFile;

const memoryUsage = () => {
  // An example displaying the respective memory
  // usages in megabytes(MB)
  for (const [key, value] of Object.entries(process.memoryUsage())) {
    console.log(`Memory usage by ${key}, ${Number(value) / 1000000}MB `);
  }
};

describe("test [FastCsv] basic test", function () {
  test.skip("it must parse the file correctly with filters", async function () {
    const columns: ColumnType[] = [
      { key: "distrito_id", value: ColumnValueType.number },
      { key: "distrito_nombre", value: ColumnValueType.string },
      { key: "region", value: ColumnValueType.number },
      { key: "nodo", value: ColumnValueType.string },
      { key: "categoria", value: ColumnValueType.string },
      { key: "departamento_id", value: ColumnValueType.string },
      { key: "departamento_nombre", value: ColumnValueType.string },
      { key: "domicilio_municipalidad", value: ColumnValueType.string },
      { key: "cod_postal", value: ColumnValueType.string },
      { key: "tel_cod_area", value: ColumnValueType.string },
      { key: "telefono_1", value: ColumnValueType.number },
      { key: "telefono_", value: ColumnValueType.number },
      { key: "email", value: ColumnValueType.string },
      { key: "web", value: ColumnValueType.string },
    ];

    await FastCsvParse({ filepath, columns });

    // An example displaying the respective memory
    // usages in megabytes(MB)
    memoryUsage();
  });

  test("it must parse the file correctly without filters", async function () {
    const fastcsv = await FastCsvParse({ filepath });

    assert(fastcsv.getRows().length === 999999);

    memoryUsage();
  });
});
