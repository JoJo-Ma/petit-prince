const db = require("./db/index")
const fs = require('fs')

// let rawdata = fs.readFileSync('french_mod.json', 'utf8')
// let data = JSON.parse(rawdata).newTranslationList;
//
// const newEntry = db.query("INSERT INTO trans_text (data, trans_desc_id) VALUES ($1, $2);", [rawdata, 14]);
let rawdata = fs.readFileSync('french_shaping2.json', 'utf8')
let data = JSON.parse(rawdata);

const newEntry = db.query("INSERT INTO trans_shaping (data, trans_desc_id, language_id) VALUES ($1, $2, $3);", [rawdata, 14, 1]);
