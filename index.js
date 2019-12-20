const xlsx = require('node-xlsx').default;

let reportOne = [];
let reportTwo = [];
let reportThree = [];
let reportFour = [];

const workSheets = xlsx.parse(`${__dirname}/MM-POS-Data-Test-Report-1.xlsx`);
// .data[1][0] is row 1 col 0
console.log('info...', workSheets[0].data[1][4], workSheets[0].data[4700][4]);
updateReportOne();
console.log('reportOne...', reportOne);

function updateReportOne() {
    let storecodeList = [];
    let barcodeList = [];
    let totalQuantity = 0;
    let dateActive;

    for (const [i, row] of workSheets[0].data.entries()) {
        if (i > 10) break; //testing
        if (i === 0) continue; // header

        let storecode = row[0].split(':')[0];
        let storename = row[0].split(':')[1];
        let productname = row[1].split('] ')[1];
        let barcode = row[2];
        let UoM = row[3];
        let dateOrder = row[4];
        let quantity = Number(row[5]);

        // initial
        if (i === 1) {
            reportOne = [[storecode, storename]];
            storecodeList.push(storecode);
            barcodeList.push(barcode);
            dateActive = dateOrder;
            continue;
        }

        if (!storecodeList.includes(storecode)) {
            storecodeList.push(storecode);
            barcodeList.push(barcode);
            reportOne = [...reportOne, [storecode, storename, productname, barcode, UoM]];
            totalQuantity = quantity;
            dateActive = dateOrder;
        }
        else if (!barcodeList.includes(barcode)) {
            barcodeList.push(barcode);
            reportOne = [...reportOne, [storecode, storename, productname, barcode, UoM]];
            totalQuantity = quantity;
            dateActive = dateOrder;
        }
        else if (dateOrder !== dateActive) {
            // reportOne[reportOne.length-1].push(totalQuantity);
            let index = reportOne.findIndex(row => {
                return row[3] === barcode;
            });
            reportOne[index].push(totalQuantity);
            totalQuantity = quantity;
        }
        else {
            totalQuantity += quantity;
        }
        // console.log('dateactive', dateActive);
    }
}
