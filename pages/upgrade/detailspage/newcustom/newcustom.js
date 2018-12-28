// pages/upgrade/detailspage/newcustom.js
const host = require('../../../../config').host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    url: '../../masterlist/custom-demand/custom-demand',
    demandContent: '',
<<<<<<< HEAD
    prerequisite: '',
    Flag: true
=======
    prerequisite: ''
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
  },
  /**
   * 生命周期函数--监听页面加载
   */
<<<<<<< HEAD
  onLoad: function(options) {
    var that = this;
    var userMode = wx.getStorageSync('userMode') || {};
    var searchKeyword = '';
    if (options.enterpriseCustom) {
=======
  onLoad: function (options) {
    var that = this;
    var userMode = wx.getStorageSync('userMode') || {};
    var searchKeyword = ''; 
    if(options.enterpriseCustom){
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      that.setData({
        searchKeyword: options.enterpriseCustom,
        url: '../../masterlist/enterprise-research/enterprise-research'
      })
    }
<<<<<<< HEAD
    if (options.url) {
=======
    if (options.url){
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      if (options.reportName) {
        searchKeyword = '关于 “' + options.reportName + '” 行业研究的定制需求';
      }
      that.setData({
        prerequisite: options.prerequisite,
        searchKeyword: searchKeyword,
        url: options.url + '?modelId=' + options.id + '&&openid=' + options.openid + '&&verifyFlage=' + userMode.verifyFlage
      })
    }
  },
<<<<<<< HEAD
  bindKeywordInput: function(e) {
=======
  bindKeywordInput: function (e) {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    this.setData({
      searchKeyword: e.detail.value
    })
  },
<<<<<<< HEAD
  doSave: function() {
    var that = this;
    var user = wx.getStorageSync('user') || {};
    if (!that.data.Flag) return;
    that.setData({
      Flag: false
    });
=======
  doSave: function () {
    var that = this;
    var user = wx.getStorageSync('user') || {};
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    wx.request({
      url: host + 'industryResearch/doCustomDemand.do',
      data: {
        openId: user.openid,
        url: that.data.url,
        demandContent: that.data.searchKeyword
      },
      method: 'POST',
<<<<<<< HEAD
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.statusCode == 200) {
          that.setData({
            Flag: true
          });
          wx.redirectTo({
            url: res.data.pagePath
          })

        }
      
      }
    });
  },
  doCancel: function() {
=======
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.redirectTo({
            url: res.data.pagePath
          })
        }
      }
    })

  },
  doCancel: function () {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    wx.navigateBack()
  }
})