var util = require('../../../../utils/util.js');
var home_item = require('../../../common/switchhomepage/home_item.js');
const host = require('../../../../config').host;
Page({
  data: {
	prerequisite:'',
	id:'',
	hotSpotId:'',
  searchSongList:[]
  },
  fetchSearchList: function(){
    let that = this;
	wx.request({
		url:host+'enterprise/similarEnterprise.do',
		data:{
      tmEnterpriseId:that.data.id,
			hotSpotId:that.data.hotSpotId
		},
		method: 'POST',
		header: { "Content-Type": "application/x-www-form-urlencoded" },
		success: function (res) {
		  if (res.statusCode == 200) {
        for (var i in res.data){
          if (!res.data[i].tmEnterpriseId){
            res.data[i].titleCss = '#666';
          }
        }
        that.setData({
          searchSongList: res.data
        })
		  }
		}
	})
  },
  informationDts: function (option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../../detailspage/information-dts/information-dts';
    util.readingStatus(infoId, 'INFORMATION', url);
  },
  // 返回上一步
  navigateBack: function () {
    wx.navigateBack()
  },
  onLoad: function (option){
    var that = this;
    that.setData({
		  id:option.id,
		  hotSpotId:option.hotSpotId
	  })
	that.fetchSearchList();
  },
  similarbind: function (options){
    var that = this;
    var modelId = options.currentTarget.dataset.similarid;
    var user = wx.getStorageSync('user') || {};
    var userMode = wx.getStorageSync('userMode') || {};
    if (modelId){
        wx.redirectTo({
          url: '../enterprise-dts/enterprise-dts?modelId=' + modelId + '&&verifyFlage=' + userMode.verifyFlage + '&&openid=' + user.openid
        })
    }
  }
})