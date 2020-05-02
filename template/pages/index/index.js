const app = getApp();
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
        catesList:[],   //产品分类
        productList:[], //数据列表
    },
    onLoad() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        this.getcatesList()
        this.getUserInfo()
    },
    onReady() {
    },
    getcatesList(){ //获取产品分类
        https.GET({
            API_URL: "/api.php/paotui/product/cates",
            success: (res) => {
                res.data.data.forEach((item,index)=>{
                    wx.showLoading({
                        title: '加载中...',
                        mask: true
                    });
                    this.getsub_list(item,index)
                })
            },
            fail: function () {
              console.log()
            }
        })
    },
    getsub_list(data,index){  //根据分类获取产品
        https.GET({
            API_URL: "/api.php/paotui/product/sub_list?cid="+data.cate_id,
            success: (res) => {
                if(res.data.code == 0){
                    res.data.data.forEach(item=>{
                        item['quantity'] = 0;
                        item['pid'] = data.cate_id
                    })
                    let params = {
                        name:data.name,
                        cate_id:data.cate_id,
                        goods:res.data.data
                    }
                    this.data.productList.push(params)
                    this.data.defaultcommodityJsonList.push(params)
                    this.setData({
                        productList:this.data.productList,
                        defaultcommodityJsonList: this.data.defaultcommodityJsonList
                    })
                    wx.hideLoading()
                }
                
            },
            fail: function () {
              console.log()
            }
        })
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
    commodityCut(e){     //界面数量减一
        let pId = e.currentTarget.dataset.pid;   //获取分类id
        let cId = e.currentTarget.dataset.cid;   //获取商品id
        this.data.productList.forEach(item=>{
            if(item.cate_id == pId){
                console.log('item: ', item);
                item['goods'].forEach(childItem=>{
                   if(childItem.id == cId || childItem.quantity<1){
                    childItem.quantity--
                   }
                })
            }
        })
        this.setData({
            productList : this.data.productList
        })
        this.shopcartFn()
        
    },
    commodityAdd(e){    //界面数量加一
        let pId = e.currentTarget.dataset.pid;   //获取分类id
        let cId = e.currentTarget.dataset.cid;   //获取商品id
        this.data.productList.forEach(item=>{
            if(item.cate_id == pId){
                console.log('item: ', item);
                item['goods'].forEach(childItem=>{
                   if(childItem.id == cId){
                    childItem.quantity++
                   }
                })
            }
        })
        this.setData({
            productList : this.data.productList
        })
        this.shopcartFn()
    },
    shopcartAdd(e){  //购物车数量加一
        let data =  e.currentTarget.dataset.item
        let pId = data.pid
        let cId = data.id
        this.data.productList.forEach(item=>{
            if(item.cate_id == pId){
                item['goods'].forEach(childItem=>{
                   if(childItem.id == cId){
                    childItem.quantity++
                   }
                })
            }
        })
        this.setData({
            productList:this.data.productList
        })
        this.shopcartFn()
    },
    shopcartcut(e){  //购物车数量减一
        let data =  e.currentTarget.dataset.item
        let pId = data.pid
        let cId = data.id
        this.data.productList.forEach(item=>{
            if(item.cate_id == pId){
                item['goods'].forEach(childItem=>{
                   if(childItem.id == cId || childItem.quantity<1){
                    childItem.quantity--
                   }
                })
            }
        })
        this.setData({
            productList:this.data.productList
        })
        this.shopcartFn()
    },
    shopcartFn(){   //重新对商品列表复制
        let selectshopList = [];
        this.data.productList.forEach(item=>{   //遍历取出已经在界面上加过的商品
            item.goods.forEach(childItem=>{
                if(childItem.quantity>0){
                    childItem['sumtotalPrice'] = (childItem.price*childItem.quantity).toFixed(2)
                    selectshopList.push(childItem)
                }
            })
        })
        //计算商品总数
        let shoptotalList=[];
        let shoppriceList = [];
        let shopSum,shoppricesum=0;
        selectshopList.forEach(item=>{
            let sum = (item.price*item.quantity).toFixed(2)
            shoptotalList.push(item.quantity);   //取出商品数量
            shoppriceList.push(JSON.parse(sum));    //商品价格总和

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
        shoppricesum = this.sum(shoppriceList)
        this.setData({
            interfaceList:selectshopList,
            shoptotal:shopSum,
            shoppricesum:shoppricesum
        })
    },
    emptyshoppingcart(){    //清空购物车
        this.data.productList.forEach((item,index)=>{
            item.goods.forEach((childItem,cindex)=>{
                childItem['quantity'] = 0
            })
        })
        this.setData({
            interfaceList:[],
            shoptotal:0,
            shoppricesum:0,
            productList:this.data.defaultcommodityJsonList
        })
        this.hideModal()
    },
    tojiesuan(){    //去结算
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        let interfaceList = []
        this.data.interfaceList.forEach(item=>{
            let interfaceDict = {};
            interfaceDict['name'] = item.name
            interfaceDict['price'] = item.price
            interfaceDict['quantity'] = item.quantity
            interfaceDict['cindex'] = item.cindex
            interfaceDict['image'] = item.cover
            interfaceDict['id'] = item.id
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
        let list = this.data.commodityJsonList;
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
                        url: 'https://www.sudaone.cn/api.php/paotui/app/login',
                        method: "POST",
                        data: {
                            code: res.code,
                        },
                        success: function(res) {
                            console.log('res: ', res);
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
    sum(arr) {  //数组求和
        var s = 0;
        for (var i=arr.length-1; i>=0; i--) {
            s += arr[i];
        }
        return s.toFixed(2);
    }
})