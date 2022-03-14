const router = require("express").Router();
const pool = require("../db")
let multer = require('multer')
let upload = multer().fields([
  {
    name : 'audio',
    maxCount: 10
  },
  {
    name : 'username',
    maxCount: 1
  },
  {
    name : 'language_id',
    maxCount: 1
  },
  {
    name : 'sentence_id',
    maxCount: 10
  }])

router.get('/:id', async (req, res) => {
  try {
    const params = req.params

    const data = await pool.query("SELECT data FROM blobtest where id = $1", [params.id])

    console.log(data.rows[0].data);
    res.json(data.rows[0].data)
  } catch (e) {
    console.error(e.message);
    res.status(500).json("server error")
  }
})

router.get('/statusRecording/:username/:language', async (req, res) => {
  try {
    const { username, language } = req.params

    console.log(username, language);

    const data = await pool.query("SELECT blobtest.sentence_id FROM blobtest \
    LEFT JOIN users ON users.id = blobtest.username_id \
    LEFT JOIN trans_desc ON blobtest.trans_desc_id = trans_desc.id \
    LEFT JOIN languages ON trans_desc.language_id = languages.id \
    WHERE users.username = $1 and languages.name = $2", [username, language])

    res.json(data.rows)
  } catch (error) {
    console.error(error.message);
  }
})

router.post('/', upload, async (req, res) => {
  try {


    const audio = req.files.audio.map(file => { return file.buffer })
    const sentenceId = req.body.sentence_id
    const languageId = req.body.language_id
    const username = req.body.username


    // expand(2) returns '($1, $2, $3, user_id_from_username), ($5, $6, $7, user_id_from_username)'
    const expand = (rowCount, startAt=1, placeholder = '(SELECT id FROM sel)') => {
      var index = startAt
      return Array(rowCount).fill(0).map(v => `(${Array(4).fill(0).map(v => {
        if (index % 4 === 0) {
          index++
          return `${placeholder}`
        }
        return `$${index++}`
      }).join(", ")})`).join(", ")
    }


    //returns 4 parameters sent to the query for the first insertion then 3 afterwards
    const formatInsert = (audio, sentenceId, languageId, username) => {
      var arr = []
      for (var i = 0; i < audio.length; i++) {
        arr.push(parseInt(sentenceId[i]),audio[i], parseInt(languageId))
        if (i == 0) {
          arr.push(username)
        }
      }
      return arr
    }

    const newEntry = await pool.query(`WITH sel as (SELECT id FROM users WHERE username = $4 ) \
    INSERT INTO blobtest (sentence_id, data, trans_desc_id, username_id) VALUES ${expand(audio.length)} RETURNING sentence_id;`, formatInsert(audio, sentenceId, languageId, username))

    console.log(newEntry.rows[0]);

    res.send(newEntry.rows[0])

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }
})

module.exports = router;
