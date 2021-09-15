const router = require('express').Router()

const exchange = require('./exchange')

router.use('/exchange',exchange)

module.exports = router