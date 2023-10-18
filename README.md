# Fastcsv

CSV Converter Library to Array for Node.js
You will be able to parse any csv file to get in a array, at parsing moment this will check data types in columns and rows.

main features:

- less costs of memory
- fast data types validations.
- get Csv rows from a specific URL.

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

## Performance metrics

**1M** rows in **957ms** without filters validations

**1M** rows in **4000ms** with filters validations

## Next features

- adding filters
- columns validation with types

## Author

Juan Andrés Carmena <juan14nob@gmail.com>

## Help me!
Please help me to improve it, if you had a issue, feel able to share it with me to fix it as soon as be possible
