const jwt = require("jsonwebtoken")
require("dotenv").config()

function jwtGenerator(user_id, admin_status) {
  const payload = {
    user: user_id,
    admin: admin_status
  }

  return jwt.sign(payload, process.env.JWTSECRET, {expiresIn: "1h"})
}

module.exports = jwtGenerator
