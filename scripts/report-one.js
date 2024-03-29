const { header1, header2 } = require('../misc/headersOne')

function generateReportOne(workSheets) {
    let dateOrderSet = new Set();
    let productMap = new Map();
    let lastDateOrder;
  
    for (const [i, row] of workSheets[0].data.entries()) {
      if (i === 0) continue; // header
  
      let storecode = row[0].split(":")[0];
      let storename = row[0].split(":")[1];
      let productname = row[1].split("] ")[1];
      let barcode = row[2];
      let uoM = row[3];
      let dateOrder = row[4];
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
  
      var resultArray = [];
      if (i === 1) {
        lastDateOrder = dateOrder;
        resultArray.push(header1)
        resultArray.push(header2)

        console.log('What is the resultArray now?')
        console.log(resultArray)
      }

      if (productMap.has(keyString)) {
        if (dateOrderSet.has(dateOrder + barcode)) {
          let currentQuantityArray = productMap.get(keyString);
          let currentQuantity = currentQuantityArray.pop();
          productMap.set(keyString, [
            ...currentQuantityArray,
            currentQuantity + quantity
          ]);
        } else {
          let currentQuantityArray = productMap.get(keyString);
          let zerosArray = [];
          let dateGap = dateOrder - lastDateOrder;
          for (let i = 0; i < dateGap; i++) {
            zerosArray.push(0);
          }
          productMap.set(keyString, [
            ...currentQuantityArray,
            ...zerosArray,
            quantity
          ]);
          dateOrderSet.add(dateOrder + barcode);
        }
      } else {
        productMap.set(keyString, [quantity]);
      }
  
      lastDateOrder = dateOrder;
    }
  
    
  
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
      if (insertingRow.length < 53) {
        let zerosArray = [];
        for (let i = 0; i < 53 - insertingRow.length; i++) {
          zerosArray.push(0);
        }
        insertingRow = [...insertingRow, ...zerosArray];
      }
  
      resultArray.push(insertingRow);
    });
    let finishedArray = [header1, header2, ...resultArray]
    return finishedArray
  }

  module.exports = generateReportOne