const { timegaps } = require('../utils/time-gap')
const timegapdefine = require('../utils/time-gap')
const { header1, header2, header3 } = require('../misc/headersTwo')

function generateReportTwo(workSheets) {
    let datetimeOrderSet = new Set();
    let productMap = new Map();
    let lastTimeOrder;
  
    for (const [i, row] of workSheets[0].data.entries()) {
      if (i === 0) continue; // header
  
      let storecode = row[0].split(":")[0];
      let storename = row[0].split(":")[1];
      let productname = row[1].split("] ")[1];
      let barcode = row[2];
      let uoM = row[3];
      let dateOrder = row[4];
      let timestamp = timegapdefine(row[5]);

      let quantity = Number(row[6]);
      let keyString =
        storename +
        "🖕" +
        storecode +
        "🖕" +
        barcode +
        "🖕" +
        productname +
        "🖕" +
        uoM;
  
      if (i === 1) {
        lastTimeOrder = timestamp;
      }

      if (productMap.has(keyString)) {
        if (datetimeOrderSet.has(String(timestamp) + String(dateOrder) + String(barcode))) {

          // If it's the same product, in the same day, at the same time gap => update the last quantity
          let currentQuantityArray = productMap.get(keyString);
          currentQuantityArray.pop();
          let currentQuantity = currentQuantityArray.pop()
          productMap.set(keyString, [
            ...currentQuantityArray,
            currentQuantity + quantity
          ]);
        } else {
          let currentQuantityArray = productMap.get(keyString);
          let zerosArray = [];
          let timeGap = Math.abs(timestamp - lastTimeOrder);
          for (let i = 0; i < timeGap; i++) {
            zerosArray.push(0);
          }
          productMap.set(keyString, [
            ...currentQuantityArray,
            ...zerosArray,
            quantity
          ]);
          datetimeOrderSet.add(String(timestamp) + '-' + String(dateOrder) + '-' + String(barcode));
        }
      } else {
        productMap.set(keyString, [quantity]);
      }
  
      lastTimeOrder = timestamp;
    }
  
    let resultArray = [];
  
    productMap.forEach((value, key, map) => {
      // key: storecode + '-' + barcode
      // value: [... cac quantity cua cac ngay]
      // storename - productname - barcode - uoM - ... quantity cac ngay
      let infos = key.split("🖕");
      let storename = infos[0];
      let storecode = infos[1];
      let barcode = infos[2];
      let productname = infos[3];
      let uoM = infos[4];
  
      let insertingRow = [
        storecode,
        storename,
        productname,
        barcode,
        uoM,
        ...value
      ];
      if (insertingRow.length < 341) {
        let zerosArray = [];
        for (let i = 0; i < 341 - insertingRow.length; i++) {
          zerosArray.push(0);
        }
        insertingRow = [...insertingRow, ...zerosArray];
      }
  
      resultArray.push(insertingRow);
    });

    let finishedArray = [header1, header2, header3, ...resultArray]
    return finishedArray
  }

  module.exports = generateReportTwo