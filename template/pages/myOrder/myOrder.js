// pages/myOrder/myOrder.js
const https = require('../../utils/ajax.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[], //订单列表
    TabCur: 0,
    scrollLeft:0,
    tabName:['待付款','待送货','已完成'],
    status:0,
    page:1,  //分页
    last_page:0,
    orderImg:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
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
    this.setData({
      page:1
    })
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  getOrderList(){   //获取订单列表
    // status:1、2、4、8分别代表的状态
    // 1、已经下单，发货中
    // 2、申请退款中，取消中
    // 3、已退款，已取消
    // 8、已完成

    let params = {
      page:this.data.page
    }
    https.POST({
      params: params,
      API_URL: "/api.php/paotui/order/my_orders",
      success: (res) => {
        let orderImg = []
        res.data.data.data.forEach(item=>{
          orderImg.push('https://www.sudaone.cn'+item.goods[0].goods_img)
        })
        this.setData({
          orderImg:orderImg,
          orderList:res.data.data.data,
          last_page:res.data.data.last_page
        })
      },
      fail: function () {
        console.log()
      }
    })
  },
  gotoDeatils(e){  //跳转到订单详情页
    let goodsList =  e.currentTarget.dataset.item
    wx.setStorage({
      key:"orderDrtail",
      data:goodsList
    })
    wx.navigateTo({
      url:'../orderDetails/orderDetails',
      success:function(){
      },        //成功后的回调；
      fail:function(){

      },          //失败后的回调；
      complete:function(){
          wx.hideLoading()
      },      //结束后的回调(成功，失败都会执行)
    })
  },
  cuidanClickFn(){
        wx.showToast({

            title:"催促送货小哥",
            duration: 4000,//提示的延迟时间，单位毫秒，默认：1500 
      
            mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
      
            success:function(){},
      
            fail:function(){},
      
            complete:function(){}
      
          })
  },
  requestRefund(){  //申请退款

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
    this.getOrderList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page
    let last_page = this.data.last_page
    if(page != last_page){
      page++
      this.setData({
        page:page
      })
      let params = {
        page : this.data.page
      }
      https.POST({
        params: params,
        API_URL: "/api.php/paotui/order/my_orders",
        success: (res) => {
          res.data.data.data.forEach(item=>{
            if(item.goods[0] != undefined){
              this.data.orderImg.push('https://www.sudaone.cn'+item.goods[0].goods_img)
            }
          })
          res.data.data.data.forEach(item=>{
            this.data.orderList.push(item)
          })
          this.setData({
            orderImg:this.data.orderImg,
            orderList:this.data.orderList,
            last_page:res.data.data.last_page
          })
        },
        fail: function () {
          console.log()
        }
      })
    }else{
      wx.showToast({
        title: '没有更多订单了',
        // icon: 'success',
        duration: 2000
    })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})