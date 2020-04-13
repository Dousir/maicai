const app = getApp();
// const shopData  = require('../../data/data.js')
// console.log('shopData: ', shopData);
const https = require('../../utils/ajax.js')
Page({
    data: {
        TabCur: 0,  //左侧一级导航栏定位
        MainCur: 0, //右侧二级title定位
        VerticalNavTop: 0,
        load: true,
        commodityJsonList:{},   //商品列表
        interfaceList:[],   //界面上点击加号存储商品
        shoptotal:0,    //商品总数
        shoppricesum:0, //商品价格总和
        openid:'',  //用户openid
        // searchInputValue:'',
        usercode:'', //每次用户登录 获取code发给后台获取openid
        defaultcommodityJsonList:[],
    },
    onLoad() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        this.getUserInfo()
        this.getProductList()
    },
    onReady() {
        wx.hideLoading()
    },
    getPerson:function(e){
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            MainCur: e.currentTarget.dataset.id,
            VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
        })
    },
    searchClick(){  //搜索商品
        let arry = []
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
    getProductList(){   //获取商品列表
        https.GET({
            API_URL: "/api.php/paotui/product/list",
            success: (res) => {
                let resData = res.data.data
                let keysName = Object.keys(res.data.data)
                let resDataList = [] 
                keysName.forEach((item,index)=>{
                    resData[item].forEach((childItem,childIndex)=>{
                        childItem['pid'] = index
                        childItem['quantity'] = 0
                    })
                    let resDataDict = {}
                    resDataDict['name'] = item
                    resDataDict['id'] = index
                    resDataDict['goods'] = resData[item]
                    resDataList.push(resDataDict)
                })
                this.setData({
                    commodityJsonList:resDataList,
                    defaultcommodityJsonList:resDataList        //用作清空购物车
                })
            },
            fail: function () {
              console.log()
            }
        })
    },
    commodityCut(e){     //界面数量减一
        let pIndex = e.currentTarget.dataset.pidx;   //一级导航，获取下标
        let cIndex = e.currentTarget.dataset.cidx;   //详细菜品,获取下标
        let quantity = this.data.commodityJsonList[pIndex].goods[cIndex].quantity;
        if(quantity<1){
            return
        }
        let amount =quantity-1; //数量加一
        let oldcommodityJsonList,newcommodityJsonList;
        oldcommodityJsonList = this.data.commodityJsonList;
        oldcommodityJsonList[pIndex].goods[cIndex].quantity = amount;
        newcommodityJsonList = oldcommodityJsonList;
        this.setData({
            commodityJsonList:newcommodityJsonList
        })
        this.shopcartFn()
        
    },
    commodityAdd(e){    //界面数量加一
        let pIndex = e.currentTarget.dataset.pidx;   //一级导航，获取下标
        let cIndex = e.currentTarget.dataset.cidx;   //详细菜品,获取下标
        let quantity = this.data.commodityJsonList[pIndex].goods[cIndex].quantity;
        
        let amount =quantity+1; //数量加一
        let oldcommodityJsonList,newcommodityJsonList;
        oldcommodityJsonList = this.data.commodityJsonList;
        oldcommodityJsonList[pIndex].goods[cIndex].quantity = amount;
        newcommodityJsonList = oldcommodityJsonList;
        this.setData({
            commodityJsonList:newcommodityJsonList
        })
        this.shopcartFn()
    },
    shopcartAdd(e){  //购物车数量加一
        let data =  e.currentTarget.dataset.item
        let pIndex = data.pid
        let cIndex = data.id
        let commodityJsonList = this.data.commodityJsonList
        commodityJsonList.forEach(item=>{
            if(item.id == pIndex){
                item.goods.forEach(childItem=>{
                    if(childItem.id == cIndex){
                        childItem.quantity++
                    }
                })
            }
        })
        this.setData({
            commodityJsonList:commodityJsonList
        })
        this.shopcartFn()
    },
    shopcartcut(e){  //购物车数量减一
        let data =  e.currentTarget.dataset.item
        if(data.quantity<1){
            return
        }
        let pIndex = data.pid
        let cIndex = data.id
        let commodityJsonList = this.data.commodityJsonList
        commodityJsonList.forEach(item=>{
            if(item.id == pIndex){
                item.goods.forEach(childItem=>{
                    if(childItem.id == cIndex){
                        childItem.quantity--
                    }
                })
            }
        })
        this.setData({
            commodityJsonList:commodityJsonList
        })
        this.shopcartFn()
    },
    shopcartFn(){   //重新对商品列表复制
        let selectshopList = [];
        this.data.commodityJsonList.forEach(item=>{   //遍历取出已经在界面上加过的商品
            item.goods.forEach(childItem=>{
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
        this.data.commodityJsonList.forEach((item,index)=>{
            item.goods.forEach((childItem,cindex)=>{
                childItem['quantity'] = 0
            })
        })
        this.setData({
            interfaceList:[],
            shoptotal:0,
            shoppricesum:0,
            commodityJsonList:this.data.defaultcommodityJsonList
        })
        this.hideModal()
    },
    tojiesuan(){    //去结算
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        let interfaceList = []
        console.log('this.data.interfaceList: ', this.data.interfaceList);
        this.data.interfaceList.forEach(item=>{
            
            let interfaceDict = {};
            interfaceDict['name'] = item.name
            interfaceDict['price'] = item.price
            interfaceDict['quantity'] = item.quantity
            interfaceDict['cindex'] = item.cindex
            interfaceDict['image'] = item.cover
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
    toUserCenter(){     //跳转到用户中心
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
        wx.login({
            success (res) {
                if (res.code) {
                    wx.request({
                        url: 'http://47.111.129.112/api.php/paotui/app/login',
                        method: "POST",
                        data: {
                            code: res.code,
                        },
                        success: function(res) {
                            wx.setStorage({
                                key:"userid",
                                data:res
                            })
                        }
                      })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    toProductDetail(e){  //跳转商品详情页
        wx.navigateTo({
            url: '../prductDetails/productDetail?productId='+e.currentTarget.dataset.foodsdata.id
          })
    },
})