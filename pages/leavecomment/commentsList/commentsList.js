var httpRequestUtil = require("../../../utils/network.js"); //require引入
Page({
    data: {
      scrollHeight: 0,      //页面高度
      currentID: 7,         //新闻类型
	    TianAPInewsList: [],  //默认数据列表
      scrollTop: 0,         //Y轴滚动条位置
      touchXStart: 0,       //X轴开始位置
      touchYStart: 0,       //Y轴开始位置
      currentPage: 1,        //默认页数
      newsVlues:"",
    },
  onLoad: function (options) {
      let that = this;
      that.setData({
         NewsTypeList: util.NewsTypeList,
         });
      this.loadNewslList(7);
      wx.showShareMenu({
        withShareTicket: true
      })
    },
    initNewsData: function () {//初始化数据
        this.setData({
            scrollTop: 0,
            TianAPInewsList: [],
            currentPage: 1,
            scrollHeight: 0
        });
    },
    refreshNewList: function (e) {//获取最新数据
        this.initNewsData();
      this.loadNewslList(this.data.currentID);
    },
    loadMoreNews: function (e) {//加载更多新闻数据
        this.setData({currentPage: this.data.currentPage + 1});
      this.loadNewslList(this.data.currentID);
    },
    setCurrentYScroll: function (event) {//设置当前Y轴滚动条位置
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },

    //NewsTypeId ==7 时
  queryNewsByType: function (NewsTypeId = ""){
      wx.request({
        url: util.txapi_base_url + '/allnews/',
        data: {
          col: NewsTypeId,
          key: util.txapi_key,
          page: that.data.currentPage,
          num: 10,
          word: that.data.newsVlues
        },
        success: function (res) {
          if (res.data.code == 200) {
            let temp_data = res.data.newslist;
            that.setData({ TianAPInewsList: res.data.newslist.concat(temp_data) });
          }
          else {
            var tianapi_error = res.data.msg + '\n错误状态码：' + res.data.code
            wx.showModal({
              title: '天行数据',
              content: tianapi_error,
              showCancel: false,
              success: function (e) {
                console.error(tianapi_error + '\n请登录天行数据tianapi.com查看接口状态')
              }
            })
          }
          wx.getSystemInfo({//设置scroll内容高度
            success: function (res) {
              that.setData({
                scrollHeight: res.windowHeight,
              });
            }
          });
          wx.hideLoading()  //关闭加载提示
        }
      })
    },

    //查询新闻 （初始化数据）
    loadNewslList: function (NewsTypeId = "") {//加载新闻列表
        let that = this;
        wx.showLoading({title: '加载中...'});
        wx.request({
          url: util.txapi_base_url + '/allnews/',
            data: {
              col: NewsTypeId,
              key: util.txapi_key,
              page: that.data.currentPage,
              num:10,
            },
            success: function (res) {
              if (res.data.code == 200) {
                let temp_data = res.data.newslist;
                that.setData({ TianAPInewsList: res.data.newslist.concat(temp_data) });
                }
                else {
                var tianapi_error = res.data.msg + '\n错误状态码：' + res.data.code
                wx.showModal({
                  title: '天行数据',
                  content: tianapi_error,
                  showCancel: false,
                  success: function (e) {
                    console.error(tianapi_error + '\n请登录天行数据tianapi.com查看接口状态')
                  }
                })
                }
                wx.getSystemInfo({//设置scroll内容高度
                    success: function (res) {
                        that.setData({
                            scrollHeight: res.windowHeight,
                        });
                    }
                });
              wx.hideLoading()  //关闭加载提示
            }
        })
    },
    handerTap: function (e) {//点击新闻分类
        let that = this;
        let tempList = this.data.NewsTypeList;
        tempList.forEach(function (item, index) {
            if (e.target.id == item.NewsTypeId) {
                that.initNewsData();
                that.setData({currentID: item.NewsTypeId});
              that.loadNewslList(item.NewsTypeId);
            }
        });

    },
  //点击新闻列表跳转
  handerNavigator: function (e) {
    var url = e.currentTarget.dataset.url    // 新闻url 
    wx.navigateTo({
      url: '/pages/view/view?url=' + url
    }); 
  },
    handerTouchStart: function (e) {//X,Y开始位置
        let temp = [];
        this.setData({touchXStart: e.changedTouches[0].clientX, touchYStart: e.changedTouches[0].clientY});
    },
    handerTouchEnd: function (e) {//判断左右滑动
        let distanceX = this.data.touchXStart - e.changedTouches[0].clientX;
        let distanceY = this.data.touchYStart - e.changedTouches[0].clientY;
        let that = this;
        let tempList = this.data.NewsTypeList;
        let tempIndex = 0;
        tempList.forEach(function (item, index) {
            if (that.data.currentID == item.NewsTypeId) {
                tempIndex = index;
            }
        });
        if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) {//左
            if (tempIndex != 0) {//分类起点向左滑动
                that.initNewsData();
                that.setData({currentID: tempList[tempIndex - 1].NewsTypeId});
                that.loadNewslList(tempList[tempIndex].NewsTypeId);
            }
        }
        else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {//右
            if (tempIndex != tempList.length) {//分类终点向右滑动
                that.initNewsData();
                that.setData({currentID: tempList[tempIndex + 1].NewsTypeId});
                that.loadNewslList(tempList[tempIndex].NewsTypeId);
            }
        }
    },
   //获取输入框的值并存入到Data中
   getInputValue:function(e){
     var that=this;
     var newsValue = e.detail.value;
     that.setData({
          newsVlues:newsValue
     });

   },
   //根据关键字查询新闻 类型7 word 关键字选填 非7 为必填才能模糊选择
   queryNewslListByWord: function (NewsTypeId = "") {//加载新闻列表
    let that = this;
    wx.showLoading({ title: '加载中...' })
    wx.request({
      url: util.txapi_base_url + '/allnews/',
      data: {
        col: NewsTypeId,
        key: util.txapi_key,
        page: that.data.currentPage,
        num: 10,
        word: that.data.newsVlues
      },
      success: function (res) {
        if (res.data.code == 200) {
          let temp_data = res.data.newslist;
          that.setData({ TianAPInewsList: res.data.newslist.concat(temp_data) });
        }
        else {
          var tianapi_error = res.data.msg + '\n错误状态码：' + res.data.code
          wx.showModal({
            title: '天行数据',
            content: tianapi_error,
            showCancel: false,
            success: function (e) {
              console.error(tianapi_error + '\n请登录天行数据tianapi.com查看接口状态')
            }
          })
        }
        wx.getSystemInfo({//设置scroll内容高度
          success: function (res) {
            that.setData({
              scrollHeight: res.windowHeight,
            });
          }
        });
        wx.hideLoading()  //关闭加载提示
      }
    })
  },
    //新闻搜索
    newsSearch:function(e){
      var that=this;
      console.log("您输入的是：" + that.data.newsVlues);
      this.queryNewslListByWord(this.data.currentID);

   },
  //点击评论新闻
  switchComments: function (e) {
    var url = e.currentTarget.dataset.url // 新闻url 
    wx.navigateTo({
      url: '../leavecomment/leavecomment?url=' + url
    });
  },
  //收藏新闻
  collectionNews: function (event) {
    let that = this;
    var newsUrl = event.currentTarget.dataset.url;
    console.log(newsUrl)   //打印出index的值
    wx.showModal({
      title: '提示',
      content: '收藏新闻',
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
});