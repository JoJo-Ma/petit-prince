const router = require("express").Router();
const db = require("../db/index")
const authorization = require('../middleware/authorization')
const userCheck = require('../middleware/usercheck')

router.get('/', async (req, res) => {
  try {
    const languages = await db.query("SELECT id,name FROM languages")

    res.json(languages.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

router.post('/', authorization, userCheck,  async (req, res) => {
  try {

    const { newLanguage } = req.body
    console.log(newLanguage);
    const newEntry = await db.query("INSERT INTO languages (name) VALUES ($1) RETURNING name;", [newLanguage])

    const returnedName = newEntry.rows[0].name

    res.send(`New draft "${returnedName}" saved with success!`)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

module.exports = router;
