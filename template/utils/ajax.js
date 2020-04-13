var requestHandler = {
  params: {},
  API_URL: '',
  token: '',
  success: function (res) {
    // success  
  },
  fail: function () {
    // fail  
  },
}

//GET请求  
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求  
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理  
  var params = requestHandler.params;
  var API_URL = requestHandler.API_URL;
  const value = wx.getStorageSync('userid')
  let requestCode = value.data.code
  let requestToken = value.data.data.token
  if(requestCode == 1111){
    wx.login({
      success (res) {
          if (res.code) {
            wx.request({
                url: 'http://47.111.129.112/api.php/paotui/app/login',
                method: "POST",
                data: {
                    code: res.code,
                },
                success: function(res) {
                  requestToken = res.data.data.token
                }
            })
          }
          else {
              console.log('登录失败！' + res.errMsg)
          }
      }
    })
  }
wx.request({
  url: `http://47.111.129.112/${API_URL}`,
  data: params,
  method: method, 
  header: {
    'content-type': 'application/json',
    'token': requestToken
    // 默认值
  }, // 设置请求的 header  
  success: function (res) {
    //注意：可以对参数解密等处理  
    requestHandler.success(res)
  },
  fail: function () {
    requestHandler.fail()
  },
  complete: function () {
    // complete  
  }
})
}
module.exports = {
  GET: GET,
  POST: POST
}


  // 用法
// https.GET({
//   params: params,
//   API_URL: "api/order/search",
//   success: (res) => {
//       console.log('res: ', res);
//   },
//   fail: function () {
//     console.log()
//   }
// })