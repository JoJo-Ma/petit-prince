const router = require("express").Router();
const db = require("../db/index")
const authorization = require('../middleware/authorization')

router.post('/drafts', authorization, async (req, res) => {
  try {
    const { username, language, data, name } = req.body

    const newEntry = await db.query("INSERT INTO drafts (username_id, language_id, data, created_on, last_modified, name) VALUES ((SELECT id FROM users WHERE username = $1), \
    (SELECT id FROM languages WHERE name = $2), $3, NOW(), NOW(), $4) RETURNING name;", [username, language, data, name])

    const returnedName = newEntry.rows[0].name

    res.send(`New draft "${returnedName}" saved with success!`)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }
})

router.get('/:username/drafts', authorization, async (req, res) => {

  try {
    const params = req.params

    const drafts = await db.query("SELECT drafts.name FROM drafts INNER JOIN users ON users.id = drafts.username_id WHERE users.username = $1;", [params.username])

    res.json(drafts.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }



})

router.get('/:username/drafts/:draftname', authorization, async (req , res) => {
  try {
    const params = req.params

    const draft = await db.query("SELECT drafts.data FROM drafts INNER JOIN users ON users.id = drafts.username_id WHERE users.username = $1 AND drafts.name = $2", [params.username, params.draftname])

    res.json(draft.rows[0].data)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }

})
module.exports = router;

router.post('/', async (req, res) => {
  try {
    const { username, language, data, name } = req.body


    // insert in trans_desc first then trans_text
    const newEntry = await db.query("WITH ins1 AS ( INSERT INTO trans_desc (username_id, language_id, is_main_trans, name) VALUES \
      ((SELECT id from users where username = $1),(SELECT id from languages where name = $2), FALSE, $3) RETURNING id AS trans_id \
    ) INSERT INTO trans_text (data, trans_desc_id) SELECT  $4, trans_id FROM ins1;", [username, language, name, data])


    res.json("ok")
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }
})

router.get('/:language', async (req, res) => {
  try {
    const params = req.params

    const translation = await db.query("SELECT trans_text.data FROM trans_text \
    LEFT JOIN trans_desc ON trans_text.trans_desc_id = trans_desc.id \
    WHERE trans_desc.is_main_trans AND trans_desc.language_id = \
    (SELECT id FROM languages WHERE name = $1 );", [params.language])

    res.json(translation.rows[0].data.newTranslationList)
  } catch (error) {
    console.error(error.message);
  }
})


//todo retrieve both language 1 and 2
router.get('/:language1/:language2', async (req, res) => {
  try {
    const params = req.params

    const translation = await db.query("(SELECT trans_text.data as data, languages.name as language FROM trans_text \
    LEFT JOIN trans_desc ON trans_text.trans_desc_id = trans_desc.id \
    LEFT JOIN languages ON trans_desc.language_id = languages.id \
    WHERE trans_desc.is_main_trans AND languages.name = $1) \
    UNION ALL\
    (SELECT trans_text.data as data, languages.name as language FROM trans_text \
    LEFT JOIN trans_desc ON trans_text.trans_desc_id = trans_desc.id \
    LEFT JOIN languages ON trans_desc.language_id = languages.id \
    WHERE trans_desc.is_main_trans AND languages.name = $2);", [params.language1, params.language2])

    res.json(translation.rows)
  } catch (error) {
    console.error(error.message);
  }
})
