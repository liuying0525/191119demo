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
    prerequisite: '',
    Flag: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userMode = wx.getStorageSync('userMode') || {};
    var searchKeyword = '';
    if (options.enterpriseCustom) {
      that.setData({
        searchKeyword: options.enterpriseCustom,
        url: '../../masterlist/enterprise-research/enterprise-research'
      })
    }
    if (options.url) {
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
  bindKeywordInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  doSave: function() {
    var that = this;
    var user = wx.getStorageSync('user') || {};
    if (!that.data.Flag) return;
    that.setData({
      Flag: false
    });
    wx.request({
      url: host + 'industryResearch/doCustomDemand.do',
      data: {
        openId: user.openid,
        url: that.data.url,
        demandContent: that.data.searchKeyword
      },
      method: 'POST',
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
    wx.navigateBack()
  }
})