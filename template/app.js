//app.js
App({
  callBusiness:function(e){
    wx.makePhoneCall({
        phoneNumber: '18565652915',
        success: function () {
            console.log("拨号成功！")
        },
        fail: function () {
            console.log("拨号失败！")
        }
    })
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


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
  globalData: {
    userInfo: null
  }
})