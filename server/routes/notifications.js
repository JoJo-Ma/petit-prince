const router = require("express").Router();
const db = require("../db/index")
const authorization = require('../middleware/authorization')
const userCheck = require('../middleware/usercheck')


router.post('/', authorization, userCheck,  async (req, res) => {
  try {
    console.log(req.body);
    const { type, subtype, message, username, id} = req.body
    const userId = req.user
    const newEntry = await db.query("WITH sel as (SELECT id FROM users WHERE username = $1 )\
    INSERT INTO notifications (username_id, created_on, type, message, viewed, subtype, issue_id)\
    VALUES ((SELECT id FROM sel), NOW(), $2, $3, false, $4, $5) RETURNING viewed;", [username, type, message, subtype, id])

    res.status(200).json({
    created:"yes",
    viewed:newEntry.rows[0].viewed})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

router.get('/:username', authorization, async (req, res) => {
  try {
    const { username } = req.params
    const response = await db.query("WITH sel as (SELECT id FROM users WHERE username = $1)\
    SELECT * FROM notifications WHERE username_id = (SELECT id FROM sel);", [username])
    res.json(response.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})

router.put('/:username/:id', authorization, userCheck, async (req, res) => {
  try {
    const { username, id } = req.params
    const response = await db.query("WITH sel as (SELECT id FROM users WHERE username = $1)\
    UPDATE notifications SET viewed = True  WHERE username_id = (SELECT id FROM sel) and id=$2;", [username, id])
    res.json(response.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})
router.put('/display/:username/:id', authorization, userCheck, async (req, res) => {
  try {
    console.log(req.params);
    const { username, id } = req.params
    const response = await db.query("WITH sel as (SELECT id FROM users WHERE username = $1)\
    UPDATE notifications SET display = False  WHERE username_id = (SELECT id FROM sel) and id=$2;", [username, id])
    console.log(response.rows);
    res.json(response.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error")
  }
})



module.exports = router;
