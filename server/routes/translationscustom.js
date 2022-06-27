const mandarinToPinyin = require('hanzi-to-pinyin')

const router = require("express").Router();
const db = require("../db/index")

router.get('/mandarin/:word', async (req, res) => {

    try {
        const {word} = req.params
        const pinyin = await mandarinToPinyin(word)
        res.json({pinyin,
        text: pinyin.map(el => {
            if(Array.isArray(el)) {
                return `(${el.join(',')})`
            } 
            return el.trim()
        }).join(' ')})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error oops")
    }
  
  
  
  })

  module.exports = router;
