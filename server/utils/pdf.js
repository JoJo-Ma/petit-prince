const fs = require('fs'),
    PDFParser = require("pdf2json");
const fetch= require("node-fetch")
// const pdfParser = new PDFParser(this,1);

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on("pdfParser_dataReady", pdfData => {
//     const res = pdfParser.getRawTextContent()
//     // fs.writeFile("./test.json", JSON.stringify(pdfData));
//     console.log(res.length);
// });
//
// pdfParser.("./st_exupery_le_petit_prince.pdf");

const url = "http://www.cmls.polytechnique.fr/perso/tringali/documents/st_exupery_le_petit_prince.pdf"

const getpdf = async (url) => {
  try {
    console.log("toto");
    const response = await fetch(url, {
      method: "GET",
      headers: {"Content-Type": "text/pdf"}
    })

    const parseRes = await response.json()
    console.log(parseRes);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = getpdf
