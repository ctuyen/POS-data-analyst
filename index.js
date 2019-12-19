const xlsx = require('node-xlsx').default;

let reportOne = [];
let reportTwo = [];
let reportThree = [];
let reportFour = [];

const workSheets = xlsx.parse(`${__dirname}/MM-POS-Data-Test-Report-1.xlsx`);
// .data[1][0] is row 1 col 0
// console.log('info...', workSheets[0].data[1][0].split(':')[0]);
updateReportOne();
console.log('reportOne...', reportOne);

function updateReportOne() {
    let storecodeList = [];
    let barcodeList = [];

    for (const [i, row] of workSheets[0].data.entries()) {
        // console.log('i', i);
        if (i > 10) break; //testing
        if (i === 0) continue;

        let storecode = row[0].split(':')[0];
        let storename = row[0].split(':')[1];
        let barcode = row[2];
        let dateOrder = row[4];

        // initial
        if (i === 1) {
            reportOne = [[storecode, storename]];
            storecodeList.push(storecode);
            barcodeList.push(barcode);
            continue;
        }

        if (!storecodeList.includes(storecode)) {
            storecodeList.push(storecode);
            reportOne = [...reportOne, [`${row[0].split(':')[0]}`, `${row[0].split(':')[1]}`]]
        }
        else if (!barcodeList.includes(barcode)) {

        }
    }
}
