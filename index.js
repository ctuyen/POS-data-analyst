const xlsx = require('node-xlsx').default;

let reportOne = [];
let reportTwo = [];
let reportThree = [];
let reportFour = [];

const workSheets = xlsx.parse(`${__dirname}/MM-POS-Data-Test-Report-1.xlsx`);
reportOne = updateReportOne();
console.log('reportOne...', reportOne);


// REPORT ONE

function updateReportOne() {

    let dateOrderSet = new Set()
    let productMap = new Map()
    let lastDateOrder

    for (const [i, row] of workSheets[0].data.entries()) {
        if (i === 0) continue; // header
        
        let storecode = row[0].split(':')[0];
        let storename = row[0].split(':')[1];
        let productname = row[1].split('] ')[1];
        let barcode = row[2];
        let uoM = row[3];
        let dateOrder = row[4];
        let quantity = Number(row[6]);
        let keyString = storename + '🖕' + storecode + '🖕' + barcode + '🖕' + productname + '🖕' + uoM;

        if (i === 1){
          lastDateOrder = dateOrder;
        }
        
        if (productMap.has(keyString)){
          if (dateOrderSet.has(dateOrder+barcode)) {
            let currentQuantityArray = productMap.get(keyString);
            currentQuantityArray.pop();
            let currentQuantity = productMap.get(keyString)[productMap.get(keyString).length-1];
            productMap.set(keyString, [...currentQuantityArray, currentQuantity + quantity]);
          }
          else{
            let currentQuantityArray = productMap.get(keyString);
            let zerosArray = [];
            let dateGap = dateOrder - lastDateOrder;
            for (let i = 0; i < dateGap; i++) {
              zerosArray.push(0);
            }
            productMap.set(keyString, [...currentQuantityArray, ...zerosArray, quantity]);
            dateOrderSet.add(dateOrder+barcode);
          }
        } else{
          productMap.set(keyString,[quantity]);
        }

        lastDateOrder = dateOrder;
    }

    let resultArray = [];

    productMap.forEach((value, key, map) => {
      // key: storecode + '-' + barcode
      // value: [... cac quantity cua cac ngay]
      // storename - productname - barcode - uoM - ... quantity cac ngay
      let infos = key.split('🖕');
      let storename = infos[0];
      let storecode = infos[1];
      let barcode = infos[2];
      let productname = infos[3];
      let uoM = infos[4];

      let insertingRow = [storename,storecode,barcode,productname,uoM,...value]
      if (insertingRow.length < 52){
        let zerosArray = []
        for (let i = 0; i < 52 - insertingRow.length; i++){
          zerosArray.push(0);
        }
        insertingRow = [...insertingRow, ...zerosArray];
      }

      resultArray.push(insertingRow);
    })

    return resultArray
}
