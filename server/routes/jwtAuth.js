const router = require("express").Router()
const db = require("../db/index")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization")

router.post("/register", validInfo, async (req, res) => {
  try {

    const { username, email, password} = req.body
    const user = await db.query("SELECT * FROM users WHERE email = $1;", [email])

    if (user.rows.length !==0) {
      return res.status(401).send("User already exists")
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPwd = await bcrypt.hash(password, salt);

    const newUser = await db.query("INSERT INTO users (username, password, email, created_on, last_login) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *", [username, bcryptPwd, email])

    const token = jwtGenerator(newUser.rows[0].id)

    res.json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("server error")
  }
})

router.post('/login', validInfo, async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await db.query("SELECT * FROM users INNER JOIN user_rights ON user_rights.user_id = users.id WHERE email = $1", [email])

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect")
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password)


    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect")
    }

    const token = jwtGenerator(user.rows[0].id, user.rows[0].rights_id)

    res.json({ token })

  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error")
  }
})

router.get("/isverified", authorization, async (req, res) => {
  try {
    res.json(true)
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
})

router.get("/isadmin", authorization, async (req, res) => {
  try {
    res.json({admin:req.admin})
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error")
  }
})

module.exports = router
