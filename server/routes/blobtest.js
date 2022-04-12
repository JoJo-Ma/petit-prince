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

//get list of sentence id recorded for the username-language pair
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
    res.status(500).json("server error")
  }
})

// get list of recording available for given language (shows username)
router.get('/statusRecording/:languageId', async (req, res) => {
  try {
    const { languageId } = req.params

    const data = await pool.query("SELECT DISTINCT users.username FROM users \
    LEFT JOIN blobtest ON users.id = blobtest.username_id \
    LEFT JOIN trans_desc ON blobtest.trans_desc_id = trans_desc.id \
    WHERE trans_desc.language_id = $1", [parseInt(languageId)])

    res.json(data.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).json('server error')
  }
})


//get specific recording for a sentence on a username-language pair
router.get('/sentence-audio/:sentenceId/:username/:language_id', async (req, res) => {
  try {
    const { sentenceId, username, language_id } = req.params

    const data = await pool.query("SELECT blobtest.data FROM blobtest \
    LEFT JOIN users ON users.id = blobtest.username_id \
    WHERE blobtest.sentence_id = $1 AND users.username = $2 AND blobtest.trans_desc_id = $3", [sentenceId, username, language_id])

    console.log(data.rows[0].data);
    res.json(data.rows[0].data)

  } catch (error) {
    console.error(error.message);
    res.status(500).json("server error")
  }
})

router.post('/', upload, async (req, res) => {
  try {


    const audio = req.files.audio.map(file => { return file.buffer })
    const sentenceId = req.body.sentence_id
    const languageId = req.body.language_id
    const username = req.body.username

    console.log(formatInsert(audio, sentenceId, languageId, username));
    console.log(expand(audio.length));

    const newEntry = await pool.query(`WITH sel as (SELECT id FROM users WHERE username = $4 ) \
    INSERT INTO blobtest (sentence_id, data, trans_desc_id, username_id) VALUES ${expand(audio.length)} RETURNING sentence_id;`, formatInsert(audio, sentenceId, languageId, username))

    console.log(newEntry.rows);

    res.send(newEntry.rows)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }
})

router.put('/', upload, async (req,res) => {
  try {
    const audio = req.files.audio[0].buffer
    const sentenceId = req.body.sentence_id
    const languageId = req.body.language_id
    const username = req.body.username

    console.log(req.files.audio[0].buffer);

    const updatedEntry = await pool.query(`WITH sel as (SELECT id FROM users WHERE username = $4 ) \
    UPDATE blobtest SET data = $1 WHERE sentence_id = $2 AND trans_desc_id = $3 and username_id = (SELECT id FROM sel) RETURNING sentence_id;`, [audio, sentenceId, languageId, username])

    res.send(updatedEntry.rows)

  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error oops')
  }
})

router.delete('/sentence-audio/:sentenceId/:username/:language_id', async (req, res) => {
  try {
    const { sentenceId, username, language_id } = req.params

    const data = await pool.query("WITH sel as (SELECT id FROM users WHERE username = $2 )\
    DELETE FROM blobtest WHERE sentence_id = $1 AND username_id = (SELECT id FROM sel) AND trans_desc_id = $3", [sentenceId, username, language_id])

    res.json("success")

  } catch (error) {
    console.error(error.message);
    res.status(500).json("server error")
  }
})

//HELPER
// expand(2) returns '($1, $2, $3, user_id_from_username), ($5, $6, $7, user_id_from_username)'
const expand = (rowCount, startAt=1, placeholder = '(SELECT id FROM sel)') => {
  // the index that is used in the query
  var queryIndex = startAt
  // the index that counts the true amount of elements in the query
  var trueCountIndex = startAt
  var incrementAfterFour = false
  return Array(rowCount).fill(0).map(v => `(${Array(4).fill(0).map(v => {
    if (trueCountIndex === 4) {
      trueCountIndex++
      queryIndex++
      return `${placeholder}`
    }
    if (trueCountIndex % 4 === 0 ) {
      trueCountIndex++
      return `${placeholder}`
    }
    trueCountIndex++
    return `$${queryIndex++}`
  }).join(", ")})`).join(", ")
}

//HELPER
//returns 4 parameters sent to the query for the first insertion then 3 afterwards
const formatInsert = (audio, sentenceId, languageId, username) => {
  if (audio.length === 1) {
    return [parseInt(sentenceId), audio[0], parseInt(languageId), username]
  }
  var arr = []
  for (var i = 0; i < audio.length; i++) {
    arr.push(parseInt(sentenceId[i]),audio[i], parseInt(languageId))
    if (i === 0) {
      arr.push(username)
    }
  }
  return arr
}


module.exports = router;
