const router = require("express").Router();
const db = require("../db/index")

router.get('/', async (req, res) => {
  try {
    const languages = await db.query("SELECT id,name FROM languages")

    res.json(languages.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

module.exports = router;
