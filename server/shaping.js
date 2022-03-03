const db = require("./db/index")
const fs = require('fs')

let rawdata = fs.readFileSync('french_shaping.json', 'utf8')
let data = JSON.parse(rawdata);

data.data = data.data.map((el) => {
  return {
    id:el.id,
    type:el.type
  }
} )


fs.writeFileSync("french_shaping2.json", JSON.stringify(data));
