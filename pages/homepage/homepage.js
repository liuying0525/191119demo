// pages/homepage/homepage.js
const host = require('../../config').host;
const watermarkurl = require('../../config').watermarkurl;
var util = require('../../utils/util.js');
var menu = require('../common/menu/menu.js');
var home_item = require('../common/switchhomepage/home_item.js');
const timer = require('../../utils/wxTimer.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleHtml: '',
    item: {},
    randomicon: '?l=' + Math.random() * 999,
    searchKeyword: '', //需要搜索的字符
    menuKeyword: '',
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: util.system_val.page, // 设置加载的第几次，默认是第一次
    callbackcount: util.system_val.rows, //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadMore: true,
    concurrentPrevention: true, //防止多次发送请求
    templateName: '',
    pagePath: '',
    wxTimerList: [],
    parameter: {},
    userId: '',
    headertitle: '',
    screeningHidden: true,
    moduleCode: 'A', //右侧参数清单，参考allmenu.js
    loadingImg: util.picUrls.loading,
    watermark: '',
    inputModel: {
      industry: "",
      hotspot: "",
      registerPlace: ""
    }
  },
  //输入框事件，每输入一个字符，就会触发一次
  bindKeywordInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  // 重置按钮点击事件
  resetBtnClick: function(e) {
    this.setData({
      searchKeyword: ''
    })
  },
  //搜索，访问网络
  fetchSearchList: function() {
    
    let condition = {},
      parameter = {},
      that = this,
      placeholder = '';
    condition.searchPageNum = that.data.searchPageNum, //把第几次加载次数作为参数
      condition.url = host + that.data.pagePath;
    condition.callbackcount = that.data.callbackcount; //返回数据的个数
    parameter = that.data.parameter;
    parameter.inputVal = that.data.searchKeyword, //输入框字符串作为参数;
      util.getSearchMusic(condition, parameter, function(data) {
        util.pagingBottom(that, data); //分页底部状态切换
        var aPageNumber = (data.data.currentPage - 1) * that.data.callbackcount;
        let searchList = data.data.rows; //把取到的数组的值赋值给list
        if (searchList.length != 0) {
          var page = data.data.currentPage - 1;
          var d = {};
          var k = "searchSongList[" + page + "]";
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
          //if (that.data.isFromSearch) {
          if (that.data.templateName == 'information') {
            d[k] = home_item.getInforMationSearchList(data.data, aPageNumber);
                   
            // searchList = home_item.getInforMationSearchList(data.data, aPageNumber);
            placeholder = '全文关键字检索';
          } else if (that.data.templateName == 'enterprise') {
            d[k] = home_item.getEnterpriseSearchList(data.data, aPageNumber);
            placeholder = '企业名称或品牌检索';
          }
          // } else {
          //   if (that.data.templateName == 'information') {
          //     searchList = that.data.searchSongList.concat(home_item.getInforMationSearchList(data.data, aPageNumber));
          //   } else if (that.data.templateName == 'enterprise') {
          //     searchList = that.data.searchSongList.concat(home_item.getEnterpriseSearchList(data.data, aPageNumber));
          //   }
          // }
          that.setData(d);
          that.setData({
            // searchSongList: d, //获取数据数组
            concurrentPrevention: true, //防止多次发送请求
            placeholder: placeholder
          });
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
        }
      })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function(e) {
    this.setData({
      searchPageNum: 1, //第一次加载，设置1
      searchSongList: [], //放置返回数据的数组,设为空
      isFromSearch: true, //第一次加载，设置true
      searchLoading: false, //把"上拉加载"的变量设为false，显示
      concurrentPrevention: true //防止多次发送请求
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件
  searchScrollLower: function() {
    let that = this;
    if (that.data.concurrentPrevention) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false, //触发到上拉事件，把isFromSearch设为为false
        concurrentPrevention: false, //防止多次发送请求
        searchLoading: false, //把"上拉加载"的变量设为false，显示
      });
      that.fetchSearchList();
    }
  },
  onLoad: function(option) {


    var that = this;
    var userId = wx.getStorageSync('userId') || '';
    // var userId = util.getOpenId().openId || '';
    // console.log('userId', util.getOpenId().openId)
    
    that.setData({
      userId: wx.getStorageSync('userId') || ''
    })
    if (userId != '') {
      that.setData({
        watermark: "background:url('" + watermarkurl + userId + "')"
      })
    } else {
      that.setData({
        watermark: "background:url('" + watermarkurl + option.userId + "')"
      })
    }
    this.setData({
      headertitle: wx.getStorageSync("modelName") || ""
    })
    //let data = app.towxml.toJson(res.data,'markdown');
    wx.request({
      url: host + 'customPrivacy/isAgree.do',
      data: {
        openId: util.getOpenId().openId
      },
      method: 'get',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(result) {
        // console.log("2")
        if (!result.data.success) {
          let article = app.towxml.html2wxml(result.data.content, );
          article = app.towxml.toJson(article);
          // console.log(article)
          that.setData({
            articleHtml: article
          })
        }
      }
    });
    console.log(option)
    if (userId != '') {
     // debugger
      that.setData({
        templateName: option.templet,
        pagePath: option.pagePath,
        userId: option.userId,
        // inputModel: inputModel,
        moduleCode: (option.templet == 'information' ? 'A' : 'B'),
        item: wx.getStorageSync("customMenu") || {}
      })

    } else {
      that.setData({
        templateName: option.templet,
        pagePath: option.pagePath,
        userId: option.userId,
        // inputModel: inputModel,
        moduleCode: (option.templet == 'information' ? 'A' : 'B'),
        item: wx.getStorageSync("customMenu") || {}
      })
    }
    // console.log("3")
    util.inintPicUrls(that);
    menu.init(that);
    that.anyNewNews();
    // that.verWhetherUnbound();
  },
  informationBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/information/information'
    })
  },
  enterpriseBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/enterprise/enterprise',
    })
  },
  enterpriseResearchBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/enterprise-research/enterprise-research',
    })
  },
  industryResearchBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/industry-research/industry-research',
    })
  },
  communDemandBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/commun-demand/commun-demand',
    })
  },
  customDemandBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/custom-demand/custom-demand',
    })
  },
  article_btn: function() {
    
    let vm = this;
    debugger
    wx.request({
      url: host + 'customPrivacy/agree.do',
      data: {
        openId: util.getOpenId().openId
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(result) {
        if (result.success || result.statusCode == 200) {
          vm.setData({
            articleHtml: ''
          })
        }
      }
    });
  },
  settingBind: function() {
    var me = this;
    wx.navigateTo({
      url: '../upgrade/masterlist/setting/setting?pagePath=' + me.data.pagePath + '&moduleCode=' + me.data.templateName,
    })
  },
  subscribeBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/custom-subscribe/custom-subscribe',
    })
  },
  collectionBind: function() {
    wx.navigateTo({
      url: '../upgrade/masterlist/collection/collection',
    })
  },
  about: function() {
    wx.navigateTo({
      url: '../upgrade/detailspage/about/about',
    })
  },
  informationDts: function(option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../upgrade/detailspage/information-dts/information-dts';
    util.readingStatus(infoId, 'INFORMATION', url);
  },
  enterpriseDts: function(option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../upgrade/detailspage/enterprise-dts/enterprise-dts';
    util.readingStatus(infoId, util.commons_locale.enterpriseStore, url);
  },
  screening: function(opt) {
debugger
    var that = this;
    var screeningHidden = false;
    if (!opt.currentTarget.dataset.screening) {

      screeningHidden = true;
    };
    menu.show(that, screeningHidden);
  },
  onShow: function() {
    // console.log(Math.random());
    var that = this;

    // that.fetchSearchList();
    that.anyNewNews();
  },
  anyNewNews: function() {
    var customMenu = wx.getStorageSync("customMenu") || {}
    var newMenu = {};
    newMenu.topOne = [];
    newMenu.topTow = [];
    for (var i = 0; i < customMenu.length; i++) {
      if (i < 5) {
        newMenu.topOne.push(customMenu[i]);
      } else {
        newMenu.topTow.push(customMenu[i]);
      }
    }
    var that = this;
    wx.request({
      url: host + 'demand/demandUpdateCss.do',
      data: {
        openId: util.getOpenId().openId
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(result) {
        if (result.statusCode == 200) {
          let custom = result.data.data.conditions.customDemandUpdateCss,
            commun = result.data.data.conditions.notCustomDemandUpdateCss
          for (var i in customMenu) {
            if (customMenu[i].id == 50) {
              if (commun && commun == 'YES') {
                customMenu[i].prompt = 'prompt';
              }
            }
            if (customMenu[i].id == 60) {
              if (custom && custom == 'YES') {
                customMenu[i].prompt = 'prompt';
              }
            }
          }
          that.setData({
            item: newMenu
          })
        }
      }
    })
  },
  verWhetherUnbound: function() {
    var that = this;
    var user = wx.getStorageSync('user') || {};
    var wxTimer1 = new timer({
      beginTime: "00:00:30",
      name: 'wxTimer1',
      complete: function() {
        var date = new Date();
        wx.request({
          url: host + 'phone/verWhetherUnbound.do',
          data: {
            openId: user.openid
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
            if (res.statusCode == 200) {
              if (!res.data.conditions.openId) {
                util.promptJump('微信账号失效，请重新绑定！', 3000, '../index/index');
              } else {
                wxTimer1.stop();
                wxTimer1.start(that);
              }
            }
          },
          fail: function(e) {
            util.promptJump('与服务器断开连接...', 3000, '../index/index');
          }
        })
      }
    })
    wxTimer1.start(that);
  },
  skipHomePage: function() {
    wx.reLaunch({
      url: '../../../index/index',
    })
  }
})