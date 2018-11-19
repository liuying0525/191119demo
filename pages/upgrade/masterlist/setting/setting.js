// pages/upgrade/masterlist/setting.js
const host = require('../../../../config').host;
var menu = require('../../../common/menu/menu.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting:true,
    parameter: {},
    moduleCode: 'G'//右侧参数清单，参考allmenu.js
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    menu.init(me);
    me.setData({
      pagePath: options.pagePath,
      moduleCode: options.moduleCode
    });
  },
 keywordSearch:function(){
      var me=this;
      var data = me.data.checkedItem;
      wx.removeStorageSync('checkedItem');
      menu.getAllMenu().updateSettingData(host,data,function(){
        wx.reLaunch({
          url: '../../../homepage/homepage?templet=' + me.data.moduleCode + '&pagePath=' + me.data.pagePath
        });
      });
      
  }
})