Page({
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586359063366&di=af11146210da4920614adfa7d1d03115&imgtype=0&src=http%3A%2F%2Fwww.ce.cn%2Fcysc%2Fsp%2Finfo%2F201203%2F20%2FW020120320399021005135.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586359063366&di=f6d5ffdf363c3a0b5b4a5df841804a70&imgtype=0&src=http%3A%2F%2Fimg008.hc360.cn%2Fy3%2FM02%2FE3%2F69%2FwKhQh1V_gliER2WqAAAAAJ_VDeg053.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586359063366&di=1f20c92c2c663d849e3f6fe577035c9b&imgtype=0&src=http%3A%2F%2Fimg37.ddimg.cn%2Fimgother1%2F85%2F2%2F60308707_2.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586359063366&di=10e806b396d23a3923b721cd2e017031&imgtype=0&src=http%3A%2F%2Fec4.images-amazon.com%2Fimages%2FI%2F81QJGgDJklL._SL1500_.jpg'
    }],
    product:{}
  },
  onLoad(option) {
    console.log('option: ', option);
    // console.log(eval('obj =' + option.productData))
    // this.setData({
    //   product:JSON.parse(option.productData)
    // })
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
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