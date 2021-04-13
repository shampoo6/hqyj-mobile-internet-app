import express from 'express'
import bodyParser from 'body-parser'
import cryptoJs from 'crypto-js'
import WXBizDataCrypt from './WXBizDataCrypt.js'
import axios from 'axios'

const appId = 'wx9b2daa4d3a447583'
const secret = 'd99588781ab3998df7f97d267eabbf9b'

const app = express()
const port = 9527

let wxData = {
    session_key: '',
    openid: ''
}

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// 解析 application/json
app.use(bodyParser.json())

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    // Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next()
})

// 登录记录session_key和openid
app.get('/login', (req, res) => {
    console.log(req.query)

    axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${req.query.code}&grant_type=authorization_code`).then(res => {
        console.log(res.data)
        wxData.session_key = res.data.session_key
        wxData.openid = res.data.openid
    }).catch(reason => {
        console.error(reason)
    })

    res.json({msg: 'ok'})
})

// 数据校验
app.get('/validateData', (req, res) => {
    console.log(req.query)
    let signture = cryptoJs.SHA1(req.query.rawData + wxData.session_key)
    console.log(signture.toString())
    console.log(signture.toString() === req.query.signature)
    res.json({result: signture.toString() === req.query.signature})
})

// 解密用户的敏感数据
app.get('/decode', (req, res) => {
    // 解密demo的下载地址：https://res.wx.qq.com/wxdoc/dist/assets/media/aes-sample.eae1f364.zip

    let pc = new WXBizDataCrypt(appId, wxData.session_key)

    let data = pc.decryptData(req.query.encryptedData, req.query.iv)

    console.log('解密后 data: ', data)

    res.json(data)

    // if (decoded.watermark.appid !== this.appId) {
    //     throw new Error('Illegal Buffer')
    // }
})

app.listen(port, () => {
    console.log(`server start on: http://localhost:${port}`)
})
