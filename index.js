const xlsx = require("node-xlsx").default;

const updateReportOne = require("./scripts/report-one")

var fs = require("fs");
var wstream = fs.createWriteStream("outputs/template1.xlsx");
let reportOne = [];
let reportTwo = [];
let reportThree = [];
let reportFour = [];

const workSheets = xlsx.parse(`${__dirname}/MM-POS-Data-Test-Report-1.xlsx`);
reportOne = updateReportOne(workSheets);

var buffer = xlsx.build([{ name: "Outcome Report1", data: reportOne }]); // Returns a buffer
wstream.write(buffer);
wstream.end();

// REPORT ONE


