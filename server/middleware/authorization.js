const jwt = require("jsonwebtoken")
require("dotenv").config

module.exports = async (req, res, next) => {
  try {
    console.log('authorization');
    const jwtToken = req.header("token")

    if(!jwtToken) {
        return res.status(403).json('Not Authorized')
    }


    const payload = jwt.verify(jwtToken, process.env.JWTSECRET)
    console.log(payload);
    req.user = payload.user
    req.admin = payload.admin
    console.log('authorization ok');

  } catch (error) {
    console.error(error.message)
    return res.status(403).json('Not Authorized')
  }

  next()
}
