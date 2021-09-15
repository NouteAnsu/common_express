const router = require('express').Router()

//로직(컨트롤러)
var exchange = require('../controllers/exchange')

router.post('/result',exchange.result)

module.exports = router