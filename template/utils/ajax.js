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
const reqQueue = []
function request(method, requestHandler) {
  //注意：可以对params加密等处理  
  var params = requestHandler.params;
  var API_URL = requestHandler.API_URL;
  let userToken = getApp().globalData.userInfoData.token
  wx.request({
    url: `https://www.sudaone.cn/${API_URL}`,
    data: params,
    method: method, 
    header: {
      'content-type': 'application/json',
      'token': userToken
      // 默认值
    }, // 设置请求的 header  
    success: function (res) {
      if(res.data.code == 1111){
          reqQueue.push(request(method, requestHandler))
          wx.login({
            success (res) {
                if (res.code) {
                  wx.request({
                      url: 'https://www.sudaone.cn/api.php/paotui/app/login',
                      method: "POST",
                      data: {
                          code: res.code,
                      },
                      success: function(res) {
                        getApp().globalData.userInfoData = res.data.data
                      }
                  })
                }
                else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
          })
      }
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