var util = require('../../utils/util.js')
Page({
    data: {

    },
  onLoad: function (options) {
      var that=this;
       //that.loadNewsContent(options.url);//调用函数
      that.setData({ 
        htmlUrl: options.url 
      });
      wx.showShareMenu({
        withShareTicket: true
      })
    },
  //加载新闻内容
  /*loadNewsContent: function (url) {
    let that = this;
    wx.showLoading({ title: '加载中...' })
    wx.request({
      url: util.txapi_base_url + '/txapi/htmltext/',
      data: {
        key: util.txapi_key,
        url: url
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.setNavigationBarTitle({
            title: res.data.newslist[0].title
          })
          that.setData({
            TianAPInewsTitle: res.data.newslist[0].title,
            TianAPInewsContent: res.data.newslist[0].content,
            TianAPInewsContentTime: res.data.newslist[0].ctime
          });
        }
        else {
          wx.showModal({
            title: '天行数据',
            content: res.data.msg + '\n错误状态码：' + res.data.code,
            showCancel: false,
            success: function (res) {
              wx.navigateBack()
            }
          })
        }
        wx.hideLoading()  //关闭加载提示
      }
    })
  }*/
});