// pages/myOrder/myOrder.js
const https = require('../../utils/ajax.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[1],
    TabCur: 0,
    scrollLeft:0,
    tabName:['待付款','待送货','我的订单'],
    status:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options: ', options.tabIndex);
    this.setData({
      TabCur: options.tabIndex
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  gotoDeatils(){  //跳转到订单详情页
    wx.navigateTo({
      url:'../orderDetails/orderDetails',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success:function(){
      },        //成功后的回调；
      fail:function(){

      },          //失败后的回调；
      complete:function(){
          wx.hideLoading()
      },      //结束后的回调(成功，失败都会执行)
    })
  },
  tabSelect(e) {  //nav切换
    console.log('e: ', e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  cuidanClickFn(){
        wx.showToast({

            title:"催促送货小哥",
            duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
      
            mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
      
            success:function(){},
      
            fail:function(){},
      
            complete:function(){}
      
          })
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