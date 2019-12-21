const xlsx = require("node-xlsx").default;

const generateReportOne = require("./scripts/report-one")
const generateReportTwo = require("./scripts/report-two")

const fs = require("fs");
let reportOne = [];
let reportTwo = [];
let reportThree = [];
let reportFour = [];

const workSheets = xlsx.parse(`${__dirname}/MM-POS-Data-Test-Report-1.xlsx`);
reportOne = generateReportOne(workSheets);
reportTwo = generateReportTwo(workSheets);

let wstream = fs.createWriteStream("outputs/template1.xlsx");
let buffer = xlsx.build([{ name: "Outcome Report1", data: reportOne }]); // Returns a buffer
wstream.write(buffer);
wstream.end();

let wstream2 = fs.createWriteStream("outputs/template2.xlsx");
let buffer2 = xlsx.build([{ name: "Outcome Report2", data: reportTwo }]); // Returns a buffer
wstream2.write(buffer2);
wstream2.end();

