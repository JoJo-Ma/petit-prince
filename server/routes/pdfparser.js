const router = require("express").Router();
const axios = require("axios")
PDFParser = require("pdf2json");

router.get('/', async (req, res) => {
  try {

    const url = decodeURI(req.query.url)

    console.log(url);

    const response = await axios({
      url: encodeURI(url),
      responseType: 'arraybuffer',
      method: "GET",
      headers: {"Content-Type": "text/pdf"}
    })


    console.log(typeof response.data);

    const pdfParser = new PDFParser(this,1);


    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        const text = pdfParser.getRawTextContent()
        // fs.writeFile("./test.json", JSON.stringify(pdfData));
        res.status(200).send(text)
    });

    pdfParser.parseBuffer(response.data);


  } catch (e) {
    console.error(e.message);
    res.status(500).json("server error")
  }
})

router.post('/', async (req, res) => {
  try {

    const { url }  = req.body


    const response = await axios({
      url: encodeURI(decodeURI(url)),
      responseType: 'arraybuffer',
      method: "GET",
      headers: {"Content-Type": "text/pdf"}
    })


    console.log(typeof response.data);

    const pdfParser = new PDFParser(this,1);


    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        const text = pdfParser.getRawTextContent()
        // fs.writeFile("./test.json", JSON.stringify(pdfData));
        res.status(200).send(text)
    });

    pdfParser.parseBuffer(response.data);


  } catch (e) {
    console.error(e.message);
    res.status(500).json("server error")
  }
})

module.exports = router;
