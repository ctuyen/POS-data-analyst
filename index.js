const xlsx = require("node-xlsx").default;
var fs = require("fs");
var wstream = fs.createWriteStream("template1.xlsx");
let reportOne = [];
let reportTwo = [];
let reportThree = [];
let reportFour = [];

const workSheets = xlsx.parse(`${__dirname}/MM-POS-Data-Test-Report-1.xlsx`);
reportOne = updateReportOne();
console.log("reportOne...", reportOne);

var buffer = xlsx.build([{ name: "Outcome Report1", data: reportOne }]); // Returns a buffer
wstream.write(buffer);
wstream.end();

// REPORT ONE

function updateReportOne() {
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

    if (i === 1) {
      lastDateOrder = dateOrder;
    }

    if (productMap.has(keyString)) {
      if (dateOrderSet.has(dateOrder + barcode)) {
        let currentQuantityArray = productMap.get(keyString);
        currentQuantityArray.pop();
        let currentQuantity = productMap.get(keyString)[
          productMap.get(keyString).length - 1
        ];
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
      storename,
      storecode,
      barcode,
      productname,
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

  let header1 = [
    0,
    0,
    0,
    0,
    "QUANTITY PER DAY",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ];
  let header2 = [
    "Store Code",
    "Store Name",
    "Product Name",
    "Barcode",
    "UoM",
    "1-Oct",
    "2-Oct",
    "3-Oct",
    "4-Oct",
    "5-Oct",
    "6-Oct",
    "7-Oct",
    "8-Oct",
    "9-Oct",
    "10-Oct",
    "11-Oct",
    "12-Oct",
    "13-Oct",
    "14-Oct",
    "15-Oct",
    "16-Oct",
    "17-Oct",
    "18-Oct",
    "19-Oct",
    "20-Oct",
    "22-Oct",
    "22-Oct",
    "23-Oct",
    "24-Oct",
    "25-Oct",
    "26-Oct",
    "27-Oct",
    "28-Oct",
    "29-Oct",
    "30-Oct",
    "31-Oct",
    "1-Nov",
    "2-Nov",
    "3-Nov",
    "4-Nov",
    "5-Nov",
    "6-Nov",
    "7-Nov",
    "8-Nov",
    "9-Nov",
    "10-Nov",
    "11-Nov",
    "12-Nov",
    "13-Nov",
    "14-Nov",
    "15-Nov",
    "16-Nov",
    "17-Nov"
  ];

  return [...header1, ...header2, ...resultArray];
}
