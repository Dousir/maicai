const https = require('../../utils/ajax.js')

Page({
  data: {
    cardCur: 0,
    productId:'', //产品id
    swiperList: [],
    product:{}
  },
  onLoad(option) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.setData({
      productId:option.productId
    })
    this.getProductDetail();
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
  },
  getProductDetail(){   //获取产品详细信息
    let productId = this.data.productId
    https.GET({
      params: {
        id:productId
      },
      API_URL: "/api.php/paotui/product/info",
      success: (res) => {
        wx.hideLoading()
        this.setData({
          product:res.data.data,
          swiperList:[
            {
              id: 0,
              type: 'image',
              url: res.data.data.cover
            }
          ]
        })
          console.log('res: ', res);
      },
      fail: function () {
        console.log()
      }
    })
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  previewImg:function(e){
    var index = 0;
    var imgArr = this.data.swiperList;
    let urlList = [];
    imgArr.forEach(element => {
      urlList.push(element.url)
    });
    wx.previewImage({
      current: urlList[index],     //当前图片地址
      urls: urlList,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }
})