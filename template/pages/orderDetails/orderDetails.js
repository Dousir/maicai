// pages/orderDetails/orderDetails.js
const https = require('../../utils/ajax.js')

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:{},
    modalName:null,
    modaltext:'',
    modalTitle:'',
    modalStatus:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options: ', JSON.parse(options));
    let getStorageOrderData =  wx.getStorageSync('orderDrtail')
    console.log('getStorageOrderData: ', getStorageOrderData);
    this.setData({
      orderDetail:getStorageOrderData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  callbusiness(){
    app.callBusiness();
  },
  foshop(){
    let orderDetail = this.data.orderDetail;
    let userAddressId = orderDetail.user_address_id;
    let params = {}
    let goods = {}
    orderDetail.goods.forEach((item,index)=>{
      goods[item.product_id] = item.goods_number
    })
    console.log('goods: ', goods);
    params['goods'] =goods
    params['user_address_id'] = userAddressId
    params['remark'] = '' 
    https.POST({
        params: params,
        API_URL: '/api.php/paotui/order/shop',
        success: (res) => {
          this.fopay(res.data.data.id)
        },
        fail: function (res) {}
    })
  },
  fopay(data){    //支付接口
    console.log('data: ', data);
    let params = {
        order_id:JSON.parse(data)
    }
    https.POST({
        params: params,
        API_URL: '/api.php/paotui/order/pay',
        success: (res) => {
            console.log('res: ', res.data.data);
            wx.requestPayment(
                {
                'timeStamp': JSON.stringify(res.data.data.timeStamp),   //时间戳
                'nonceStr': res.data.data.nonceStr,     //随机数,
                'package': res.data.data.package,       //统一下单接口返回的 prepay_id 参数值,
                'signType': 'MD5',
                'paySign': res.data.data.sign,      //签名,
                'success':function(res){
                    console.log('res1:', res);
                },
                'fail':function(res){
                    console.log('res2:', res);

                },
                'complete':function(res){
                    console.log('res3:', res);

                }
            })
        },
        fail: function (res) {}
      })
  },
  requestRefund(){  
    let params = {
      order_id : this.data.orderDetail.order_id
    }
    let modalStatus = this.data.modalStatus
    if(modalStatus == '0'){
      https.POST({    //申请退款
        params: params,
        API_URL: '/api.php/paotui/order/order_back',
        success: (res) => {
          if(res.data.code == 0){
            this.data.orderDetail.status = 2
            this.setData({
              orderDetail : this.data.orderDetail
            })
            this.hideModal()
          }
          console.log('res: ', res);
        },
        fail: function (res) {}
      })
    }else{    
      https.POST({    //取消订单
        params: params,
        API_URL: '/api.php/paotui/order/cenel',
        success: (res) => {
          if(res.data.code == 0){
            wx.showToast({
              title: '订单已取消',
              icon: 'success',
              duration: 2000
            })
            this.hideModal()
            wx.navigateBack({ //返回
              delta: 1
            })
          }
        },
        fail: function (res) {}
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  showModal(e) {
    console.log('e: ', e);
    if(e.currentTarget.dataset.item == '0'){
      this.setData({
        modaltext:'是否要申请退款',
        modalTitle:'申请退款',
        modalStatus:'0'
      })
    }else{
      this.setData({
        modaltext:'是否要取消这个订单',
        modalTitle:'取消订单',
        modalStatus:'1'
      })
    }
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
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

  },
})