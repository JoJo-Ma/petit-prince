const router = require("express").Router();
const db = require("../db/index")
const authorization = require('../middleware/authorization')
const userCheck = require('../middleware/usercheck')


router.post('/audio', authorization, userCheck,  async (req, res) => {
  try {
    console.log(req.body);
    const { language, type, subtype, message, username_id} = req.body
    const userId = req.user
    // const newEntry = await db.query(, [])

    res.status(200).send(`New issue saved with success!`)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})



module.exports = router;
