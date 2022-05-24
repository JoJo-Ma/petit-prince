const router = require("express").Router();
const db = require("../db/index")
const authorization = require('../middleware/authorization')
const userCheck = require('../middleware/usercheck')


//todo
router.post('/', authorization, userCheck,  async (req, res) => {
  try {
    console.log(req.body);
    const { language, type, subtype, comment, audio_username, currentId } = req.body
    const userId = req.user
    const newEntry = await db.query("WITH record_user as (SELECT id from users where username = $7), \
    tr_desc_id as (SELECT trans_desc.id from trans_desc INNER JOIN languages on languages.id = trans_desc.language_id where languages.name = $5)\
    INSERT INTO issue_log (username_id, created_on, status, type, subtype, comment, trans_desc_id, sentence_id, audio_username_id) \
    VALUES ($1, NOW(), 'OPEN', $2, $3, $4, (select * from tr_desc_id), $6, (select * from record_user)) \
    RETURNING type;", [userId, type, subtype, comment,language, currentId, audio_username])

    const returnedName = newEntry.rows[0].name

    res.send(`New issue saved with success!`)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

module.exports = router;
