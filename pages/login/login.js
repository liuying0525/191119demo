const host = require('../../config').host; 
const picUrl = require('../../config').picUrl;
var allMenu = require('../../utils/allMenu.js');
var util = require('../../utils/util.js')

Page({
  j_username: function (e) {   //获取input输入的值 
    var that = this;
    that.setData({
      j_username: e.detail.value
    })
  },
  j_password: function (e) {    //获取input输入的值
    var that = this;
    that.setData({
      j_password: e.detail.value
    })
    var j_password = that.data.j_password
    if (j_password.length === 0) {
      wx.showToast({
        title: '请输入密码！',
        duration: 2000
      })
    }
  },
  /**
     * 登录
     */
  formSubmit: function (e) {
    var that = this;
    // e.detail.value.j_username = '牛一'
    // e.detail.value.j_password = 'ml123456'
    if (!e.detail.value.j_username) {
      wx.showToast({
        title: '请输入用户名！',
        duration: 1000
      });
      return;
    }
    if (!e.detail.value.j_password){
      wx.showToast({
        title: '请输入密码！',
        duration: 1000
      });
      return;
    }
    var usernameVal = e.detail.value.j_username;   
    var passwordVal = e.detail.value.j_password;   
    var user = {};  
   
    if (wx.getStorageSync('user')){
      user = wx.getStorageSync('user');

      wx.request({
        url: host + 'phone/login.do',
        data: {
          j_username: usernameVal,
          j_password: passwordVal,
          'openId': user.openid
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        }, success: function (res) {
       

          if (!res.data.message) {
            var customMenuList = res.data.customMenu;
            for (var i in customMenuList) {
              customMenuList[i].wxIconCls =picUrl + customMenuList[i].wxIconCls;
            }
            wx.setStorageSync("customMenu", customMenuList);
            wx.setStorageSync("entrys", res.data.entrys);
            wx.setNavigationBarTitle({
              title: res.data.modelName,
            });
            allMenu.initMap('F', host, function () { });
            that.verifyCustomerViewData();
            var url = '../homepage/homepage?templet=' + res.data.modelType + '&pagePath=' + res.data.pagePath + '&userId=' + res.data.userId;
            // wx.setStorageSync("pagePath", url);
			wx.setStorageSync('userId', res.data.userId);//存储openid
            wx.redirectTo({
              url: url
            })
          } else {
            wx.showToast({
              title: res.data.message,
              duration: 1000
            });
          }
        }, fail: function (res) {
          wx.showToast({
            title: '系统忙，请稍后重试！',
            duration: 1000
          });
        }
      });
    }else{
      wx.showToast({
        title: '用户绑定失败，请联系系统管理员！',
        duration: 2000
      })
    }
  },
  /**
   * 重置
   */
  formReset: function () {
    
  },
  /**
   * 页面的初始数据
   */
  data: {

  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../upgrade/masterlist/information/information'
    })
  },
  onLoad:function(){
    var that = this;
    util.inintPicUrls(that);
  },
  verifyCustomerViewData:function(){
    var user = wx.getStorageSync('user') || {};
    wx.request({
      url: host +'information/verifyCustomerViewData.do',
      data: {
        openId: user.openid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        let userMode = {};
        userMode.verifyFlage = res.data.verifyFlage;
        userMode.customersViewNumber = res.data.customersViewNumber;
        wx.setStorageSync('userMode', userMode);
      }
    })
  }
})