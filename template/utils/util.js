const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const callphone = ()=>{
  
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
}

module.exports = {
  formatTime: formatTime,
  callphone:callphone
}
