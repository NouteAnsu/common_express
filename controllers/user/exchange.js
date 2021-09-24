const axios = require('axios')
const cheerio = require('cheerio')
exports.currentRate = async (_, res) => {
    try {
        var authkey = process.env.DATA_AUTH_KEY
        var result = await axios.get('https://www.koreaexim.go.kr/site/program/financial/exchangeJSON', {
            params: {
                authkey,
                data: 'AP01'
            }
        })
        var deal_bas_r = ''//매매기준율
        var bkpr = ''//정부가격
        if (result.data[0].result === 1) {
            result.data.map(o => {
                if (o.cur_unit === 'USD') {
                    deal_bas_r = o.deal_bas_r
                    bkpr = o.bkpr
                }
            })
            console.log('환율불러오기 성공')
            res.status(200).json({ "resultCode": 1, "data": { deal_bas_r, bkpr } })
        } else if (result.data[0].result === 2) {
            console.log('데이터코드 오류')
            res.status(400).json({ "resultCode": -20, "data": null })
        } else if (result.data[0].result === 3) {
            console.log('인증코드 오류')
            res.status(400).json({ "resultCode": -30, "data": null })
        } else {
            console.log('요청횟수 초과')
            res.status(400).json({ "resultCode": -999, "data": null })
        }
    } catch (error) {
        console.log('현재 환율 조회 실패' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}

exports.crolling = async (_, res) => { //환율,달러지수 크롤링
    try {
        //환율 크롤링
        var items1 = []
        var last_arial = 0
        var arial_20 = 0
        var rate = await axios.get('https://kr.investing.com/currencies/usd-krw')
        var $1 = cheerio.load(rate.data)
        var content1 = $1('div.top>span')
        content1.each((i, elem) => {
            items1.push(elem.childNodes[0])
        })
        last_arial = parseFloat((items1[0].data).split(",").join(""))
        arial_20 = items1[1].data


        //달러지수 크롤링
        var items2 = []
        var last_index = 0
        var index_20 = 0
        var indice = await axios.get('https://kr.investing.com/currencies/us-dollar-index')
        var $2 = cheerio.load(indice.data)
        var content2 = $2('div.top>span')
        content2.each((i, elem) => {
            items2.push(elem.childNodes[0])
        })
        last_index = parseFloat((items2[0].data).split(",").join())
        index_20 = items2[1].data
        console.log('환율,지수 크롤링 성공')
        res.status(200).json({ "resultCode": 1, "data": { last_arial, arial_20, last_index, index_20 } })
    } catch (error) {
        console.log('크롤링 실패:' + error)
        res.status(400).json({ "resultCode": -1, "data": null })
    }
}