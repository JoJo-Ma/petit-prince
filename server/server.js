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


app.use("/api/auth", require("./routes/jwtAuth"))

app.use("/api/dashboard", require("./routes/dashboard"))

app.use("/api/pdfparser", require("./routes/pdfparser"))

app.use("/api/languages", require("./routes/languages"))
app.use("/api/translations", require("./routes/translations"))

app.use("/api/blobtesting", require('./routes/blobtest'))
app.use("/api/pictures", require('./routes/pictures'))
app.use("/api/issuelog", require('./routes/issuelog'))
app.use("/api/notifications", require('./routes/notifications'))
app.use("/api/email", require('./routes/email'))
app.use("/api/transcustom", require('./routes/translationscustom'))

app.listen(port, () =>{
  console.log(`server is up and listening on port ${port}`)
})
