const axios = require('axios')

exports.currentRate = async (_, res) => {
    try {
        var authkey = process.env.DATA_AUTH_KEY
        var result = await axios.get('https://www.koreaexim.go.kr/site/program/financial/exchangeJSON',{
            params:{
                authkey,
                data:'AP01'
            }
        })
        var deal_bas_r = ''//매매기준율
        var bkpr = ''//정부가격
        if(result.data[0].result===1){
            result.data.map(o=>{
                if(o.cur_unit==='USD'){
                    deal_bas_r=o.deal_bas_r
                    bkpr=o.bkpr
                }
            })
            console.log('환율불러오기 성공')
            res.status(200).json({"resultCode":1, "data":{deal_bas_r,bkpr}})
        }else if(result.data[0].result===2){
            console.log('데이터코드 오류')
            res.status(400).json({"resultCode":-20, "data":null})
        }else if(result.data[0].result===3){
            console.log('인증코드 오류')
            res.status(400).json({"resultCode":-30, "data":null})
        }else{
            console.log('요청횟수 초과')
            res.status(400).json({"resultCode":-999, "data":null})
        }
    } catch (error) {
        console.log('현재 환율 조회 실패'+error)
        res.status(400).json({"resultCode":-1, "data":null})
    }
}