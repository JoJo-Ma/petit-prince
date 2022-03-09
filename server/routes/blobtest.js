const router = require("express").Router();
const pool = require("../db")
let multer = require('multer')
let upload = multer().single('audio')

router.get('/:id', async (req, res) => {
  try {
    const params = req.params

    const data = await pool.query("SELECT data FROM blobtest where id = $1", [params.id])

    console.log(data.rows[0].data);
    res.json(data.rows[0].data)
  } catch (e) {
    console.error(e.message);
    res.status(500).json("server error")
  }
})

router.post('/', upload, async (req, res) => {
  console.log(req.file);
  try {

    const data  = req.file.buffer
    console.log(data);
    const newEntry = await pool.query("INSERT INTO blobtest (data) VALUES ($1) RETURNING data;", [data])

    console.log(newEntry.rows[0].data);
    console.log(data);

    res.send({data})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error oops")
  }
})

module.exports = router;
