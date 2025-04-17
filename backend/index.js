/* eslint-disable no-undef */
const express = require('express')
const app = express()
const port = 5173
const mongoDB = require('./db.js')
mongoDB()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})