// pages/settlement.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        interfaceList:[],   //上一页用户传入的商品list
        shopSum:0,  //商品价格总和
        receipt:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       let interfaceList = JSON.parse(options.data)
        this.setData({
            interfaceList:interfaceList,
        });
        console.log(this)
        this.totalpriceFn()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    totalpriceFn(){ //计算商品总价
        let shoppriceList = [];
        let shopSum = 0
        this.data.interfaceList.forEach(item => {
            shoppriceList.push(item.price*item.quantity)
        });
        shopSum = shoppriceList.reduce((n,m)=>{
            return n + m;
        })
        console.log('shopSum: ', shopSum);
        this.setData({
            shopSum : shopSum
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