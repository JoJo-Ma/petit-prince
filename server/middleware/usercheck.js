const db = require("../db/index")


// upon requesting data filtered by a username, will send response 403 if the user requesting isnt the same as the user in the request, unless they have admin rights

module.exports = async (req, res, next) => {
  try {
    console.log('checking user');

    const params = req.params
    const body = req.body


    const user = await db.query("SELECT users.username as username, user_rights.rights_id from users INNER JOIN user_rights ON user_rights.user_id = users.id WHERE users.id = $1;", [req.user])

    console.log(user.rows[0].username, params.username);
    // user right 0 is non admin right, anything else above is
    if (user.rows[0].username === params.username || user.rows[0].username === body.username || user.rows[0].rights_id > 0 ) {
      console.log('usercheck ok');
      next()
    } else {
      console.log('user not authorized');
      return res.status(403).json('Not Authorized')
    }

  } catch (error) {
    console.error(error.message)
    return res.status(403).json('Not Authorized')
  }

}
