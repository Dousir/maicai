const app = getApp();
const shopData  = require('../../data/data.js')

Page({
    data: {
        TabCur: 0,  //左侧一级导航栏定位
        MainCur: 0, //右侧二级title定位
        VerticalNavTop: 0,
        load: true,
        commodityAmount:0,    //菜品数量
        commodityJsonList:{},   //模拟数据json
        interfaceList:[],   //界面上点击加号存储商品
        shoptotal:0,    //商品总数
        shoppricesum:0, //商品价格总和
        openid:'',
        searchInputValue:''
    },
    onLoad() {
        this.getUserInfo()
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        let goods = shopData.shopData.goods
        goods.forEach((item,index)=>{
            item.foods.forEach((childItem,cindex)=>{
                childItem['quantity'] = 0
                childItem['pindex'] = index
                childItem['cindex'] = cindex
            })
        })
        this.setData({
            commodityJsonList:shopData.shopData
        })
    },
    onReady() {
        wx.hideLoading()
    },
    getPerson:function(e){
        console.log(this.data.openid);
        console.log(e);
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            MainCur: e.currentTarget.dataset.id,
            VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
        })
    },
    searchClick(){  //搜索商品
        let arry = [];
        let searchInputValue = this.data.searchInputValue;
        let foodsList = this.data.commodityJsonList.goods;
        foodsList.forEach(item=>{
            item.foods.forEach(childItem=>{
                if(childItem.name.match(searchInputValue) != null){
                    arry.push(childItem)
                }
            })
        })
    },
    commodityCut(e){     //界面数量减一
        let pIndex = e.currentTarget.dataset.pidx;   //一级导航，获取下标
        let cIndex = e.currentTarget.dataset.cidx;   //详细菜品,获取下标
        let quantity = this.data.commodityJsonList.goods[pIndex].foods[cIndex].quantity;
        if(quantity<1){
            return
        }
        let amount = quantity-1; //数量减一
        let oldcommodityJsonList,newcommodityJsonList;
        oldcommodityJsonList = this.data.commodityJsonList;
        oldcommodityJsonList.goods[pIndex].foods[cIndex].quantity = amount;
        newcommodityJsonList = oldcommodityJsonList;
        this.setData({
            commodityJsonList:newcommodityJsonList
        })
        this.shopcartFn()
    },
    commodityAdd(e){    //界面数量加一
        let pIndex = e.currentTarget.dataset.pidx;   //一级导航，获取下标
        let cIndex = e.currentTarget.dataset.cidx;   //详细菜品,获取下标
        let quantity = this.data.commodityJsonList.goods[pIndex].foods[cIndex].quantity;
        let amount =quantity+1; //数量加一
        let oldcommodityJsonList,newcommodityJsonList;
        oldcommodityJsonList = this.data.commodityJsonList;
        oldcommodityJsonList.goods[pIndex].foods[cIndex].quantity = amount;
        newcommodityJsonList = oldcommodityJsonList;
        this.setData({
            commodityJsonList:newcommodityJsonList
        })
        this.shopcartFn()
    },
    shopcartAdd(e){  //购物车数量加一
        let data =  e.currentTarget.dataset.item
        let pIndex = data.pindex
        let cIndex = data.cindex
        let quantity = this.data.commodityJsonList.goods[pIndex].foods[cIndex].quantity;
        let amount =quantity+1; //数量加一
        let oldcommodityJsonList,newcommodityJsonList;
        oldcommodityJsonList = this.data.commodityJsonList;
        oldcommodityJsonList.goods[pIndex].foods[cIndex].quantity = amount;
        newcommodityJsonList = oldcommodityJsonList;
        this.setData({
            commodityJsonList:newcommodityJsonList
        })
        this.shopcartFn()
    },
    shopcartcut(e){  //购物车数量减一
        let data =  e.currentTarget.dataset.item
        let pIndex = data.pindex
        let cIndex = data.cindex
        let quantity = this.data.commodityJsonList.goods[pIndex].foods[cIndex].quantity;
        if(quantity<1){
            return
        }
        let amount =quantity-1; //数量减一
        let oldcommodityJsonList,newcommodityJsonList;
        oldcommodityJsonList = this.data.commodityJsonList;
        oldcommodityJsonList.goods[pIndex].foods[cIndex].quantity = amount;
        newcommodityJsonList = oldcommodityJsonList;
        this.setData({
            commodityJsonList:newcommodityJsonList
        })
        this.shopcartFn()
    },
    shopcartFn(){   //重新对商品列表复制
        //
        let selectshopList = [];
        this.data.commodityJsonList.goods.forEach(item=>{   //遍历取出已经在界面上加过的商品
            item.foods.forEach(childItem=>{
                if(childItem.quantity>0){
                    selectshopList.push(childItem)
                }
            })
        })
        //计算商品总数
        let shoptotalList=[];
        let shoppriceList = [];
        let shopSum,shoppricesum=0;
        selectshopList.forEach(item=>{
            shoptotalList.push(item.quantity);   //取出商品数量
            shoppriceList.push(item.price*item.quantity);    //商品价格总和
        })
        if(selectshopList.length == 0){
            this.hideModal()
            this.setData({
                interfaceList:[],
                shoptotal:0,
                shoppricesum:0
            })
            return
        }
        shopSum = shoptotalList.reduce((n,m)=>{
            return n + m;
        })
        shoppricesum = shoppriceList.reduce((n,m)=>{
            return n + m;
        })
        this.setData({
            interfaceList:selectshopList,
            shoptotal:shopSum,
            shoppricesum:shoppricesum
        })
    },
    emptyshoppingcart(){    //清空购物车
        let goods = shopData.shopData.goods
        goods.forEach((item,index)=>{
            item.foods.forEach((childItem,cindex)=>{
                childItem['quantity'] = 0
                childItem['pindex'] = index
                childItem['cindex'] = cindex
            })
        })
        this.setData({
            interfaceList:[],
            shoptotal:0,
            shoppricesum:0,
            commodityJsonList:shopData.shopData
        })
        this.hideModal()
    },
    callphone(e){
        var tel = e.currentTarget.dataset.tel;
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
    tojiesuan(){    //去结算
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        let interfaceList = [];
        this.data.interfaceList.forEach(item=>{
            let interfaceDict = {};
            interfaceDict['name'] = item.name
            interfaceDict['price'] = item.price
            interfaceDict['quantity'] = item.quantity
            interfaceDict['cindex'] = item.cindex
            // interfaceDict['image'] = item.image
            interfaceList.push(interfaceDict)
        })
        interfaceList= JSON.stringify(interfaceList)
        wx.navigateTo({
            url:'../settlement/settlement?data='+interfaceList,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success:function(){
            },        //成功后的回调；
            fail:function(){

            },          //失败后的回调；
            complete:function(){
                wx.hideLoading()
            },      //结束后的回调(成功，失败都会执行)
        })
    },
    showModal(e) {  //显示购物车
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({ //隐藏购物车
            modalName: null
        })
    },
    toUserCenter(){ //跳转到用户中心
        wx.navigateTo({
            url:'../userCenter/userCenter',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success:function(){
            },        //成功后的回调；
            fail:function(){

            },          //失败后的回调；
            complete:function(){
                wx.hideLoading()
            },      //结束后的回调(成功，失败都会执行)
        })
    },
    VerticalMain(e) {
        let that = this;
        let list = this.data.commodityJsonList.goods;
        let tabHeight = 0;
        if (this.data.load) {
            for (let i = 0; i < list.length; i++) {
                let view = wx.createSelectorQuery().select("#main-" + list[i].id);
                view.fields({
                    size: true
                }, data => {
                    list[i].top = tabHeight;
                    tabHeight = tabHeight + data.height;
                    list[i].bottom = tabHeight;
                }).exec();
            }
            that.setData({
                load: false,
                list: list
            })
        }
        let scrollTop = e.detail.scrollTop + 20;
        for (let i = 0; i < list.length; i++) {
            if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                that.setData({
                    VerticalNavTop: (list[i].id - 1) * 50,
                    TabCur: list[i].id
                })
                return false
            }
        }
    },


    getUserInfo(){
        // 查看是否授权
        wx.getSetting({
            success (res){
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                success: function(res) {
                    try {
                        wx.setStorage({
                            key:"userInfo",
                            data:res.userInfo
                          })
                        // wx.setStorageSync('userInfo', res.userInfo);
                      } catch (e) { 
                        //弹框提示
                        wx.showToast({
                          title: '用户数据获取失败，请检查相关配置，是否联网等',
                          icon: 'none',
                          duration: 2000
                        });
                      }
                }
                })
            }
            }
        })
    },
    toProductDetail(e){  //跳转商品详情页
        delete e.currentTarget.dataset.foodsdata.ratings
        let productDetail = JSON.stringify(e.currentTarget.dataset.foodsdata)
        console.log('productDetail: ', productDetail);
        wx.navigateTo({
            url: '../prductDetails/productDetail?productData='+productDetail
            //  url: '../logs/logs'
          })
        console.log(e)
    },
})