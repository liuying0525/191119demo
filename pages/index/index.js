const host = require('../../config').host;
const allMenu = require('../../utils/allMenu.js');
const picUrl = require('../../config').picUrl;
const openIdUrl = require('../../config').openIdUrl

Page({
  data: {
    motto: '正在加载中...',
    // avatarUrl:'../../images/loading.gif',
    userInfo: {},
    ///Orgin
    appid: 'wxd485e82ae7d449d7',//appid
     secret: 'b75cebc085cd916642b740a71dc580e7',//secret
    
    
    // secret: '7bb79110b48d1b00a1d858c209585a03',
    ///Mine
    // appid: 'wx56552d1342c84b86',


    // secret: 'ed4aeeb93daeb330dfe7d65306377b80',

  },

  onLoad: function() {
    var that = this;
    that.getOpenId(that, function () {
      that.verifyLogin(that);
    })
    // 测试appid
    // that.testOpenId(that, function() {
    //     that.verifyLogin(that);
    // })
  },
  getOpenId: function(obj, callback) {
    var user = wx.getStorageSync('user') || {};
    wx.removeStorageSync('checkedItem');
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))) {
      wx.login({
        success: function(logins) {
        
          wx.request({
            url: host + 'phone/getOpenId.do',
            data: {
              code: logins.code
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              if (res.statusCode == 200) {
                var data = res.data.data;
                var appObj = {};
                if (data.openid) {
                  appObj.openid = data.openid;
                  appObj.expires_in = Date.now() + data.expires_in;
                  wx.setStorageSync('user', appObj); //存储openid
                  callback();
                } else {
                  wx.showModal({
                    title: '登录信息',
                    content: '获取openid失败请联系系统管理员。',
                  })
                }
              } else {

              }
            },
            fail: function(error) {
              wx.showModal({
                title: '请求失败',
                content: error.errMsg,
              })
            }
          })
        }
      })
    }
  },
  verifyLogin: function(obj) {
    var user = wx.getStorageSync('user') || {};
   
    if (user.openid) {
      wx.request({
        url: host + 'phone/checkLogin.do',
        data: {
          openId: user.openid
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          // wx.setStorageSync('userId', res.data.userId);//存储openid
          var userid = wx.getStorageSync('user').openid;
          if (res.data.modelName) {
            var customMenuList = res.data.customMenu;
            for (var i in customMenuList) {
              customMenuList[i].wxIconCls = picUrl + customMenuList[i].wxIconCls;
            }
            wx.setStorageSync("customMenu", customMenuList);
            wx.setStorageSync("entrys", res.data.entrys);
            wx.setStorageSync("modelName", res.data.modelName);
            wx.setNavigationBarTitle({
              title: res.data.modelName,
            })
            obj.verifyCustomerViewData();
            allMenu.initMap('F', host, function() {});
            var url = '../homepage/homepage?templet=' + res.data.modelType + '&pagePath=' + res.data.pagePath + '&userId=' + userid;
            console.log("url=" + url);
            wx.redirectTo({
              url: url
            });
          } else {
            wx.redirectTo({
              url: '../login/login'
            });
          }
        },
        fail: function(error) {
          wx.showModal({
            title: '登录信息',
            content: '服务器断开连接....',
          })
        }
      });
    } else {
      wx.showModal({
        title: '登录信息',
        content: '获取openid失败。',
      })
    }
  },
  verifyCustomerViewData: function() {
    var user = wx.getStorageSync('user') || {};
    wx.request({
      url: host + 'information/verifyCustomerViewData.do',
      data: {
        openId: user.openid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        let userMode = {};
        userMode.verifyFlage = res.data.verifyFlage;
        userMode.customersViewNumber = res.data.customersViewNumber;
        wx.setStorageSync('userMode', userMode);
      }
    })
  },
  testOpenId: function(obj, callback) {
    var user = wx.getStorageSync('user') || {};
    wx.removeStorageSync('checkedItem');
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))) {
      wx.login({
        success: function(logins) {
          if (logins.code) {

            var datas = obj.data; //这里存储了appid、secret、token串
            var url = openIdUrl + '?appid=' + datas.appid + '&secret=' + datas.secret + '&js_code=' + logins.code + '&grant_type=authorization_code';
            wx.request({
              url: url,
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function(openids) {
                var appObj = {};
                if (openids.data.openid) {
                  appObj.openid = openids.data.openid;
                  appObj.expires_in = Date.now() + openids.data.expires_in;
                  wx.setStorageSync('user', appObj); //存储openid
                  callback();
                } else {
                  wx.showModal({
                    title: '登录信息',
                    content: '获取openid失败请联系系统管理员。',
                  })
                }
              },
              fail: function(error) {
                wx.showModal({
                  title: '登录信息',
                  content: '不合法域名。',
                })
              }
            });
          } else {
            wx.showModal({
              title: '登录信息',
              content: '获取用户登录状态失败！。' + logins.errMsg,
            })
          }
        }
      });
    }
  },
  bindViewTap: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  }
})