const https = require('../../utils/ajax.js')

// pages/settlement.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        interfaceList:[],   //上一页用户传入的商品list
        shopSum:0,  //商品价格总和
        receipt:1,
        shoptotal:0,
        addressList:[],
        addressDefault:{},
        dispatchTime:'',    //派送时间
        addressId:0,
        notetext:'',
        optionsData:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            optionsData:options
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getTimeFn()
        this.getAddressList()
        let interfaceList = JSON.parse(this.data.optionsData.data)
        this.setData({
            interfaceList:interfaceList,
        });
        this.totalpriceFn()
    },
    
    
    totalpriceFn(){ //计算商品总价
        let shoppriceList = [];
        let shopSum = 0
        let shoptotalList = [];
        let shoptotal = 0
        this.data.interfaceList.forEach(item => {
            shoppriceList.push(item.price*item.quantity)
            shoptotalList.push(item.quantity)
        });
        shopSum = shoppriceList.reduce((n,m)=>{
            return n + m;
        })
        shoptotal = shoptotalList.reduce((n,m)=>{
            return n + m;
        })
        this.setData({
            shopSum : shopSum,
            shoptotal:shoptotal
        })
    },
    foshop(){    //下单接口
        let goods = {};
        this.data.interfaceList.forEach((item,index)=>{
            goods[item.id] = item.quantity
        })
        let userAddressId = JSON.parse(this.data.addressId);
        let params = {}
        params['goods'] = goods
        params['user_address_id'] = userAddressId
        params['remark'] = this.data.notetext
        if(userAddressId == 0){
            wx.showToast({
                title: '请先添加收货地址',
                icon: 'none',
                duration: 2000
            })
            return
        }
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
                        if(res.errMsg == 'requestPayment:ok'){
                            wx.redirectTo({
                                url:'../myOrder/myOrder',  
                                success:function(){
                                },        
                                fail:function(){
                    
                                },      
                            })
                        }
                    },
                    'fail':function(res){
                        wx.showToast({
                          title:"您已取消支付",
                          icon: 'none',//图标，支持"success"、"loading" 
                          duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
                        })
                        wx.navigateTo({
                            url:'../index/index',  
                            success:function(){
                            },        
                            fail:function(){
                
                            },      
                        })
                    },
                    'complete':function(res){
                    }
                })
            },
            fail: function (res) {}
          })
    },
    addAddressFn(){
        wx.navigateTo({
            url:'../address/address',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success:function(){},        //成功后的回调；
            fail:function(){},          //失败后的回调；
            complete:function(){},      //结束后的回调(成功，失败都会执行)
        })
    },
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    getAddressList(){   //获取用户收货地址
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        https.GET({
            API_URL: "api.php/paotui/user/get_user_address_list",
            success: (res) => {
                if(res.data.code == 0){
                    let resList = res.data.data
                    let defaultAddress = {}
                    if(resList.length != 0){
                        resList.forEach(item=>{
                            if(item.default == 1){
                                defaultAddress = item
                            }
                        })
                        this.setData({
                            addressList:resList,
                            addressDefault:defaultAddress,
                            addressId:JSON.parse(defaultAddress.id)
                        })
                    }
                    wx.hideLoading()
                }
            },
            fail: function () {
                console.log()
            }
        })
    },
    getNoteText(e){
        this.setData({
            notetext:e.detail.value
        })
    },
    getTimeFn(){
        var date = new Date();
        var hour=date.getHours();
        var minute=date.getMinutes();
        let dispatchTime = (hour+1)+':'+minute
        if(hour>=20){
            dispatchTime = '明天早晨9点'
        }
        this.setData({
            dispatchTime:dispatchTime
        })
    },
    clickaddress(e){ //选中收货地址列表，并赋值给页面

        this.setData({
            addressDefault:e.currentTarget.dataset.item,
            addressId:JSON.parse(e.currentTarget.dataset.item.id)
        })
        this.hideModal()
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    toaddressDetail(e){  //跳转地址详情页
        wx.navigateTo({
            url:'../address/address?modifyData='+JSON.stringify(e.currentTarget.dataset.item),  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success:function(){
            },        //成功后的回调；
            fail:function(){
      
            },          //失败后的回调；
            complete:function(){
                wx.hideLoading()
            },      //结束后的回调(成功，失败都会执行)
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getAddressList()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.hideModal()
        
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