const router = require("express").Router();
const db = require("../db/index")
const authorization = require('../middleware/authorization')

router.get('/', async (req, res) => {

  try {
    const params = req.params

    const drafts = await db.query("SELECT image_id, text_before_id, link FROM pictures")

    res.json(drafts.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }
})

module.exports = router;
