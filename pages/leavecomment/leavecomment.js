var httpRequestUtil = require("../../utils/network.js"); //require引入
const app = getApp();
Page({
  data: {
    //goodsName: [{"name": '洗衣粉', "name":'肥皂', "name":'香皂'}],
    goodIndex:0,
    goodShow: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    goodsPrice: false,
    goodsCounts: false,
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['支出', '进账'], //下拉列表的数据
    index: 0, //选择的下拉列 表下标,
    optionGoodsName:'',//选择的商品名称
    optionGoodsId:0
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      htmlUrl: options.url
    });
  },
   // 页面渲染完成
  onReady: function () {
    
  },

  onShow: function () {

    // 页面显示

  },

  onHide: function () {
    // 页面隐藏
  
  },

  onUnload: function () {
    // 页面关闭
  },
  textareaInputCom: function (e) {
    console.log(e.detail.value);
    var that=this;
    that.setData({
      comment: e.detail.value
    })
  },
  //表单提交
  formSubmit: function (e) {
    let that = this;
    var textareaInputCom = that.data.comment;
    var newsUrl = that.data.htmlUrl;
    if (textareaInputCom == '' || textareaInputCom==null) {
      wx.showModal({
        title: '提示',
        content: '请输入留言信息！！！',
      })
      return false;
    } 
    if (textareaInputCom !== ''  && textareaInputCom!==null) {
      wx.showLoading({ title: '数据请求中...', icon: 'loading', duration: 10000 });//显示请求框
      wx.request({
        url: httpRequestUtil.webUrl + 'comment/saveComments.do',
        data: {
          comment: textareaInputCom,
          newsUrl: newsUrl
        },
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值  application/x-www-form-urlencoded(post) application/json(get)
        },
        success: function (res) {
          var result = res.data.status;
          console.log(result + res.data.message);
          if (result == 200) {
           wx.showToast({
             title: '请求：' + res.data.message,
           })
          }else {
            wx.showModal({
              title: '提示',
              comment: "请求失败！请重试！",
              confirmColor: '#b02923',
              showCancel: false
            })
            return false;
          }
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '请求超时，请联系管理员！',
          })
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '请求超时，请联系管理员！',
        confirmColor: '#b02923',
        showCancel: false
      })
      return false;
    }

  },
  //返回上级页面
  returnBack: function () {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    wx.navigateBack({
      success: function () {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    })
  },

  //收藏新闻
  collectionNews:function(){
    let that = this;
    var newsUrl = that.data.htmlUrl;
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.request({
            url: httpRequestUtil.webUrl + 'news/collectionNews.do',
            data: {
              url: newsUrl
            },
            dataType: 'json',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值  application/x-www-form-urlencoded(post) application/json(get)
            },
            success: function (res) {
              var result = res.data.status;
              console.log(result + res.data.message);
              if (result == 200) {
                wx.showToast({
                  title: '请求：' + res.data.message,
                })
              } else {
                wx.showModal({
                  title: '提示',
                  comment: "请求失败！请重试！",
                  confirmColor: '#b02923',
                  showCancel: false
                })
                return false;
              }
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请求超时，请联系管理员！',
              })
            }
          })

        } else if (res.cancel) {
            console.log('用户点击取消');
            wx.showModal({
              title: '提示',
              content: '确定取消收藏',
            })
        }
      }
    })
  },
})