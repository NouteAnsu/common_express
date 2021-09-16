const router = require('express').Router()

const exchange = require('./user/exchange')
const user = require('./user/auth')

router.use('/exchange', exchange)
router.use('/user', user)

module.exports = router