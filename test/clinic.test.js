const { FastCsvParse } = require("../dist");
const filepath = __dirname + "/fixture/municipalidades-sf.csv";

const http = require("http");

const host = "localhost";
const port = 8000;

const requestListener = async function (req, res) {
  const response = await FastCsvParse().fromPath(filepath);
  console.log("Total ", response.length);

  res.writeHead(200);
  res.end(`Total rows ${response.length}`);
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

/*

(async ()=> {
    const response = await FastCsvParse().fromPath(filepath);
    console.log("Total ", response.length)
})()

*/
