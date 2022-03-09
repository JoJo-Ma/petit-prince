require("dotenv").config()
const express = require("express")
const morgan = require('morgan');
const db = require('./db/index.js')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3002

// converts the req to a json
app.use(cors())
app.use(express.json({limit: '50mb'}));


// shows in console the type of request, runtime, etc
app.use(morgan('tiny'))


app.use("/auth", require("./routes/jwtAuth"))

app.use("/dashboard", require("./routes/dashboard"))

app.use("/pdfparser", require("./routes/pdfparser"))

app.use("/languages", require("./routes/languages"))
app.use("/translations", require("./routes/translations"))

app.use("/blobtesting", require('./routes/blobtest'))

app.listen(port, () =>{
  console.log(`server is up and listening on port ${port}`)
})
