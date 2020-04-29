// pages/address.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const https = require('../../utils/ajax.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{
    },
    title:'新增收货地址',
    modifyData:false,
    defaltAddress:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.modifyData != undefined && options.modifyData != 'undefined'){
      let modifyData = JSON.parse(options.modifyData)
      console.log('modifyData: ', modifyData);
      if(modifyData.default == 1){
        this.setData({
          defaltAddress:true
        })
      }else{
        this.setData({
          defaltAddress:false
        })
      }
      this.setData({
        title:'修改收货地址',
        address:modifyData,
        modifyData:true
      })
    }else{
      this.getUserLocation()
      this.setData({
        title:'新增收货地址',
        modifyData:false
      })
    }
  },
  defaltAddress(e){
    let value = e.detail.value
    this.setData({
      defaltAddress:value
    })
  },
  tohistory(){  //返回上一页
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function () {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  loginForm(e){
    let value = wx.getStorageSync('userid')
    let submitData = e.detail.value
    let url = ''
    if(!this.data.modifyData){
      url = "api.php/paotui/user/add_user_address"
    }else{
      url = '/api.php/paotui/user/modify_user_address'
      submitData['user_id'] = value.user_id
      submitData['id'] = this.data.address.id
    }
    if(this.data.defaltAddress){  //设为默认地址   1是true 0是false
      submitData['default'] = 1
    }else{
      submitData['default'] = 0
    }
    https.POST({
      params: submitData,
      API_URL: url,
      success: (res) => {
        if(res.data.msg != 'success'){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.redirectTo({
            url:"../addressList/addressList"
          })
        }
      },
      fail: function (res) {}
    })
  },
  deleteAddress(){
    let address = this.data.address
    let params = {
      id:address.id
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          https.POST({
            params: params,
            API_URL: 'api.php/paotui/user/delete_user_address',
            success: (res) => {
              if(res.data.msg != 'success'){
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }else{
                wx.redirectTo({
                  url:"../addressList/addressList"
                })
              }
            },
            fail: function (res) {}
          })
        } 
        else if (sm.cancel) {
            
        }
        }
    })
    
  },
  getUserLocation: function () {
        let _this = this;
        wx.getSetting({
          success: (res) => {
            // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
            // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
            // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
            if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '拒绝授权',
                      icon: 'none',
                      duration: 1000
                    })
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (dataAu) {
                        if (dataAu.authSetting["scope.userLocation"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //再次授权，调用wx.getLocation的API
                          _this.getLocation();
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else if (res.authSetting['scope.userLocation'] == undefined) {
              //调用wx.getLocation的API
              _this.getLocation();
            }
            else {
              //调用wx.getLocation的API
              _this.getLocation();
            }
          }
        })
      },
      // 微信获得经纬度
      getLocation: function () {
        let _this = this;
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            var speed = res.speed
            var accuracy = res.accuracy;
            _this.getLocal(latitude, longitude)
          },
          fail: function (res) {
          }
        })
      },
      // 获取当前地理位置
      getLocal: function (latitude, longitude) {
        let _this = this;
        let qqmapsdk = new QQMapWX({
            key: '6FGBZ-OJFWS-FYHOV-62BRJ-R73K3-I2FN3' 
          });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            let user_address = {
              user_address:res.result.address
            }
            _this.setData({
                address:user_address
            })
          },
          fail: function (res) {
            console.log('res2: ', res);
          },
          complete: function (res) {
          }
        });
      },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})