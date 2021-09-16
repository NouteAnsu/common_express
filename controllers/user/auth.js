var { User } = require('../../models')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secret = require('../../config/jwt').KEY.secret


exports.signIn = async (req, res) => {
    try {
        var isAutoLogin = req.body.isAutoLogin
        var accountId = req.body.accountId
        var accessToken = ''
        var refreshToekn = ''
        var id_inToken = 0
        var username = ''
        var password = ''
        if (isAutoLogin) {
            console.log('자동 로그인')
            accessToken = req.body.accessToken
            refreshToekn = req.body.refreshToekn
            //토큰 검증
            jwt.verify(accessToken, secret, (err, user) => {
                if (err) {
                    console.log('액세스토큰 실패, 리프레쉬 검증')
                    jwt.verify(refreshToekn, secret, (err, user) => {
                        if (err) {
                            console.log('리프레쉬토큰 실패')
                            res.status(403).json({ "resultCode": -30, "data": null })
                        } else {
                            console.log('리프레쉬 토큰 검증 성공')
                            id_inToken = user.accountId
                        }
                    })
                } else {
                    console.log('액세스 토큰 검증 성공')
                    id_inToken = user.accessToken
                }
            })
            //토큰검증이 성공후
            if (accountId === id_inToken) {
                console.log('토큰값 일치')
                accessToken = jwt.sign({ accountId }, secret, { expiresIn: "24h" })
                refreshToekn = jwt.sign({ accountId }, secret, { expiresIn: "30d" })
                console.log('자동 로그인 성공')
                res.status(200).json({ "resultCode": 1, "data": { accountId, accessToken, refreshToekn } })
            } else {
                console.log('토큰값 불일치, 자동로그인 실패')
                res.status(400).json({ "resultCode": -20, "data": null })
            }
        } else {
            //아이디,패스워드 입력 로그인
            console.log('아이디,패스워드 입력 로그인')
            username = req.body.username
            password = crypto.createHash('sha512').update(req.body.password).digest('hex')
            var user = await User.findOne({
                where: { username }
            })
            if (user != null) {
                if (user.password === password) {
                    accessToken = jwt.sign({ accountId }, secret, { expiresIn: "24h" })
                    refreshToekn = jwt.sign({ accountId }, secret, { expiresIn: "30d" })
                    console.log('로그인 성공')
                    res.status(200).json({ "resultCode": 1, "data": { accountId, accessToken, refreshToekn } })
                } else {
                    console.log('비밀번호 불일치 로그인 실패')
                    res.status(400).json({ "resultCode": -20, "data": null })
                }
            } else {
                console.log('유저 없음 로그인 실패')
                res.status(400).json({ "resultCode": -20, "data": null })
            }
        }
    } catch (error) {
        console.log('로그인 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.signUp = async (req, res) => {
    try {
        var username = req.body.username
        var password = crypto.createHash('sha512').update(req.body.password).digest('hex')
        var name = req.body.name
        var phone = req.body.phone
        var bank = req.body.bank
        var socialType = 0
        var socialId = 0
        var user = await User.findOne({
            where: { username }
        })
        if (user != null) {
            console.log('이미 가입된 회원')
            res.status(400).json({ "resultCode": -10, "data": null })
        } else {
            await User.create({
                username,
                password,
                name,
                phone,
                bank,
                socialType,
                socialId
            })
            console.log('회원가입 성공')
            res.status(200).json({ "resultCode": 1, "data": null })
        }
    } catch (error) {
        console.log('회원 가입 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}


exports.userInfo = async (req, res) => {
    try {
        var accountId = req.body.accountId
        var user = await User.findOne({
            where: { id: accountId }
        })
        var username = ''
        var name = ''
        var phone = ''
        var bank = ''
        var socialType = 0
        if (user != null) {
            username = user.username
            name = user.name
            phone = user.phone
            bank = user.bank
            socialType = user.socialType
            console.log('유저 정보 조회 성공')
            res.status(200).json({ "resultCode": 1, "data": { username, name, phone, bank, socialType } })
        } else {
            console.log('유저 정보 없음')
            res.status(400).json({ "resultCode": -20, "data": null })
        }
    } catch (error) {
        console.log('유저 정보 조회 실패' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}