const express = require('express')
const app = express()
const cors = require('cors')
const Router = require('./routes/index')
const dotenv = require('dotenv')
dotenv.config()


app.use(express.json())
app.use(express.urlencoded({extended:false}))





app.use('/v1',Router)


app.listen(3000, () => {
    console.log('3000PORT CONNECTED...')
})