require("dotenv").config();
const http = require("https");

const { TheMiningConference } = require("./includes/TheMiningConference");

// Time to milliseconds conversion
let hours = 3600000;
let minutes = 60000;
let seconds = 1000;

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Hello, World!");
};

const server = http.createServer(requestListener);

const port = process.env.PORT || 8000;
server.listen(port);

function sendData() {
  TheMiningConference();
}
sendData();
setInterval(() => {
  sendData();
}, 6 * hours);
