# Fastcsv

CSV to Array library for NodeJS
you will be able to parse any csv file to get an array.
this library uses Async generators to improve the load size in memory

main features:

- less memory costs
- fast data types validations. (missing)

## Usage/Examples

```javascript
// using a filesystem path
const filepath = "YOURPATH/file.csv";
const fastCsv = await FastCsvParse({ filepath });

// using a url file
// this will download the file to be parsed once finished
const url =
  "https://ckan-static-mock-harvest-source.cloudapps.digital/mock-third-party/example-dataset-1/all-categories-summary.csv";
const fastCsv = await FastCsvParse({ url });
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/jcdesignweb/fastcsv.git

```

Go to the project directory

```bash
  cd fastcsv
```

Install dependencies

```bash
  npm install
```

Run tests

```bash
  npm test
```

## Next features

- adding filters
- columns validation with types

## Author

Juan Andrés Carmena <juan14nob@gmail.com>
