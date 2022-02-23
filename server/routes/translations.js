const router = require("express").Router();
const db = require("../db/index")

router.post('/drafts', async (req, res) => {
  try {
    const { username, language, data, name } = req.body

    const user = await db.query("SELECT id FROM users WHERE username = $1;", [username])
    const user_id = user.rows[0].id

    const lang = await db.query("SELECT id FROM languages WHERE name = $1", [language])
    const language_id = lang.rows[0].id

    const newEntry = await db.query("INSERT INTO drafts (username_id, language_id, data, created_on, last_modified, name) VALUES ($1, $2, $3, NOW(), NOW(), $4) RETURNING name;", [user_id, language_id, data, name])

    const returnedName = newEntry.rows[0].name

    res.send(`New draft "${returnedName}" saved with success!`)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }
})

router.get('/:username/drafts', async (req, res) => {

  try {
    const params = req.params

    const drafts = await db.query("SELECT drafts.name FROM drafts INNER JOIN users ON users.id = drafts.username_id WHERE users.username = $1;", [params.username])

    res.json(drafts.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }



})

router.get('/:username/drafts/:draftname', async (req , res) => {
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
