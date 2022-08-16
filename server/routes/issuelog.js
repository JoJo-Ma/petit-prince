const router = require("express").Router();
const db = require("../db/index")
const authorization = require('../middleware/authorization')
const userCheck = require('../middleware/usercheck')


//todo
router.post('/', authorization,  async (req, res) => {
  try {
    console.log(req.body);
    const { language, type, subtype, comment, audio_username, currentId } = req.body
    const userId = req.user
    const newEntry = await db.query("WITH record_user as (SELECT id from users where username = $7), \
    tr_desc_id as (SELECT trans_desc.id from trans_desc INNER JOIN languages on languages.id = trans_desc.language_id where languages.name = $5 AND trans_desc.is_main_trans = true)\
    INSERT INTO issue_log (username_id, created_on, status, type, subtype, comment, trans_desc_id, sentence_id, audio_username_id, language) \
    VALUES ($1, NOW(), 'OPEN', $2, $3, $4, (select * from tr_desc_id), $6, (select * from record_user),$5) \
    RETURNING type;", [userId, type, subtype, comment,language, currentId, audio_username])

    res.status(200).send(`New issue saved with success!`)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

router.get('/', authorization, userCheck, async (req, res) => {
  try {
    const data = await db.query("WITH requester_name AS (SELECT id, username FROM users),\
                                audio_name AS (SELECT id, username FROM users)\
                                SELECT issue_log.id, requester_name.username as req_name, created_on, modified_on, status, type, subtype, comment, trans_desc_id, sentence_id, audio_name.username as ad_name, language from issue_log\
                                INNER JOIN requester_name ON requester_name.id = issue_log.username_id\
                                FULL JOIN audio_name ON audio_name.id = issue_log.audio_username_id\
                                WHERE requester_name.username IS NOT NULL;")

    res.json(data.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

router.get('/:id', authorization, userCheck, async (req, res) => {

  try {
    const { id } = req.params
    const data = await db.query("WITH requester_name AS (SELECT id, username FROM users),\
                                audio_name AS (SELECT id, username FROM users)\
                                SELECT issue_log.id, requester_name.username as req_name, created_on, modified_on, status, type, subtype, comment, issue_log.trans_desc_id, issue_log.sentence_id, audio_name.username as ad_name, language, trans_text.data as transtext, blobtest.data as audiodata from issue_log\
                                INNER JOIN trans_text ON issue_log.trans_desc_id = trans_text.trans_desc_id\
                                INNER JOIN requester_name ON requester_name.id = issue_log.username_id\
                                FULL JOIN audio_name ON audio_name.id = issue_log.audio_username_id\
                                FULL JOIN blobtest ON blobtest.sentence_id = issue_log.sentence_id and blobtest.trans_desc_id = issue_log.trans_desc_id and blobtest.username_id = issue_log.audio_username_id\
                                WHERE issue_log.id = $1;",[id])

    res.json(data.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

router.put('/:id/:status', authorization, userCheck, async (req, res) => {
  try {
    const { id, status } = req.params

    const query = await db.query("UPDATE issue_log SET status = $2, modified_on = NOW() WHERE id = $1 RETURNING status", [id, status])
    res.send("ok")
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})


module.exports = router;
