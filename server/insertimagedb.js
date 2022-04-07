const db = require("./db/index")
const fs = require('fs')

const expand = (rowCount, startAt=1) => {
  var index = startAt
  return Array(rowCount).fill(0).map(v => `(${Array(3).fill(0).map(v => {
    return `$${index++}`
  }).join(", ")})`).join(", ")
}

const formatInsert = (data) => {
  var arr = []
  for (var i = 0; i < data.length; i++) {
    Object.values(data[i]).forEach((item, i) => {
      arr.push(item)
    })
  }
  return arr
}
let rawdata = fs.readFileSync('images_mapping.json', 'utf8')
let data = JSON.parse(rawdata).mappingImages;

console.log(expand(data.length));
console.log(formatInsert(data));

const newEntry = db.query(`INSERT INTO pictures (image_id, text_before_id, link) VALUES ${expand(data.length)}`, formatInsert(data));
