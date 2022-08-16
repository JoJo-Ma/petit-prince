const router = require("express").Router()
const db = require("../db/index")
const bcrypt = require("bcrypt")
const pool = require("../db")
const jwtGenerator = require("../utils/jwtGenerator")
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization")

router.post("/register", validInfo, async (req, res) => {
    
  
    const client = await pool.connect()
    const { username, email, password} = req.body
    const user = await db.query("SELECT * FROM users WHERE email = $1;", [email])
    let token
    try {
    if (user.rows.length !==0) {
      return res.status(401).send("User already exists")
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPwd = await bcrypt.hash(password, salt);

    await client.query('BEGIN')
    const insert = "INSERT INTO users (username, password, email, created_on, last_login) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *"
    const newUser = await client.query(insert, [username, bcryptPwd, email])
    const rightsInsert = "INSERT INTO user_rights (user_id, rights_id) VALUES ($1, 0)"
    await client.query(rightsInsert, [newUser.rows[0].id])
    const emailVerificationInsert = "INSERT INTO email_verification (username_id, is_verified) VALUES ($1,false)"
    await client.query(emailVerificationInsert, [newUser.rows[0].id])
    await client.query('COMMIT')
    token = jwtGenerator(newUser.rows[0].id)

  } catch (error) {
    console.error(error.message)
    await client.query('ROLLBACK')
    res.status(500).send("server error")
  }  finally {
    client.release()
    res.json({ token })
  }
})




router.post('/login', validInfo, async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await db.query("SELECT \
    users.*, user_rights.*, email_verification.is_verified as is_verified \
     FROM users \
    INNER JOIN user_rights ON user_rights.user_id = users.id \
    INNER JOIN email_verification ON email_verification.username_id = users.id \
    WHERE email = $1", [email])

    console.log(user.rows);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect")
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password)

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect")
    }
    console.log(user.rows[0]);
    const token = jwtGenerator(user.rows[0].id, user.rows[0].rights_id)

    res.json({ token,
      is_verified:user.rows[0].is_verified,
      username: user.rows[0].username})

  } catch (error) {
    console.log("login error", error.message);
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

router.put('/updatepwd', authorization, async (req, res) => {
  try {

    const { currentPwd, newPwd} = req.body
    const user = await db.query("SELECT * FROM users WHERE id = $1;", [req.user])

    console.log(user.rows[0]);
    const validPassword = await bcrypt.compare(currentPwd, user.rows[0].password)
    console.log('valid password', validPassword);
    if (!validPassword) {
      return res.status(401).json({
        updated:false,
        message:"Password is incorrect"
      })
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPwd = await bcrypt.hash(newPwd, salt);

    const newUser = await db.query("UPDATE users SET password = $1 WHERE id= $2", [bcryptPwd, req.user])

    const token = jwtGenerator(req.user)

    res.json({ updated:true,
      token:token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("server error")
  }
})

module.exports = router
