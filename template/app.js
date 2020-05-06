//app.js
App({
  globalData: {
    userInfoData:{}
  },
  callBusiness:function(e){
    wx.makePhoneCall({
        phoneNumber: '0792-7223887',
        success: function () {
            console.log("拨号成功！")
        },
        fail: function () {
            console.log("拨号失败！")
        }
    })
  },
  onLaunch: function() {
    let that = this
    // 用户登录
    wx.login({
      success (res) {
          if (res.code) {
              wx.request({
                  url: 'https://www.sudaone.cn/api.php/paotui/app/login',
                  method: "POST",
                  data: {
                      code: res.code,
                  },
                  success: (res)=> {
                      that.globalData.userInfoData = res.data.data
                      // wx.setStorage({
                      //     key:"userid",
                      //     data:res
                      // })
                  }
                })
          } else {
              console.log('登录失败！' + res.errMsg)
          }
      }
  })
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    }),
    wx.openSetting ({ //获取用户权限
      success(res){
          console.log('res2: ', res);
      }
  })
  },
})