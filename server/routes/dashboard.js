const router = require("express").Router();
const pool = require("../db")
const authorization = require('../middleware/authorization')

router.get('/', authorization, async (req, res) => {
  try {
    // res.json(req.user)

    const user = await pool.query("SELECT username FROM users where id = $1", [req.user])

    res.json(user.rows[0])
  } catch (e) {
    console.error(e.message);
    res.status(500).json("server error")
  }
})

module.exports = router;
