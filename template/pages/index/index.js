const app = getApp()
const shopData  = require('../../data/data.js')
Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
        list: [],
        load: true,
        commodityAmount:0,    //菜品数量
        commodityJsonList:{},
        modalName:'bottomModal'
    },
    onLoad() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        let list = [{}];
        for (let i = 0; i < 26; i++) {
            list[i] = {};
            list[i].name = String.fromCharCode(65 + i);
            list[i].id = i;
        }
        let goods = shopData.shopData.goods
        goods.forEach(item=>{
            item.foods.forEach(childItem=>{
                childItem['quantity'] = 0
            })
        })
        this.setData({
            list: list,
            listCur: list[0],
            commodityJsonList:shopData.shopData
        })
    },
    onReady() {
        wx.hideLoading()
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            MainCur: e.currentTarget.dataset.id,
            VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
        })
    },
    commodityCut(e){     //数量减一
        let pIndex = e.currentTarget.dataset.pidx;   //一级导航，获取下标
        let cIndex = e.currentTarget.dataset.cidx;   //详细菜品,获取下标
        let quantity = this.data.commodityJsonList.goods[pIndex].foods[cIndex].quantity;
        if(quantity<1){
            return
        }
        let amount = quantity-1; //数量加一
        let oldcommodityJsonList,newcommodityJsonList;
        oldcommodityJsonList = this.data.commodityJsonList;
        oldcommodityJsonList.goods[pIndex].foods[cIndex].quantity = amount;
        newcommodityJsonList = oldcommodityJsonList;
        this.setData({
            commodityJsonList:newcommodityJsonList
        })
    },
    commodityAdd(e){    //数量加一
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
    },
    showModal(e) {
        console.log(e.currentTarget.dataset.target)
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
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
    }
})