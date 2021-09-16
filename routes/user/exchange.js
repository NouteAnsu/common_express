const router = require('express').Router()

//로직(컨트롤러)
var exchange = require('../../controllers/user/exchange')

router.get('/currentRate', exchange.currentRate)

module.exports = router