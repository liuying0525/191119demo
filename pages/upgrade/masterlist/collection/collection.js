var util = require('../../../../utils/util.js');
// const watermarkurl = require('../../../../config.js').watermarkurl;
var home_item = require('../../../common/switchhomepage/home_item.js');
var menu = require('../../../common/menu/menu.js');
const host = require('../../../../config').host;
Page({
  data: {      
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: util.system_val.page,   // 设置加载的第几次，默认是第一次
    callbackcount: util.system_val.rows,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    screeningHidden:true, //筛选 默认true，隐藏
    concurrentPrevention:true, //防止多次发送请求
    loadingImg: util.picUrls.loading,
    bodybg:util.picUrls.bodybg||''
  },
  //搜索，访问网络
  fetchSearchList: function(){
    let that = this;
    var user = wx.getStorageSync('user') || {};
	wx.request({
	  url:host+"store/list.do",
	  data:{
      page:util.system_val.page,
      rows:util.system_val.rows,
      openId: user.openid
	  },
	  method:'POST',
	  header: { "Content-Type": "application/x-www-form-urlencoded" },
	  success: function (res) {
	   if (res.statusCode == 200) {
       let searchList = home_item.getCollectionList(res.data.rows); //把取到的数组的值赋值给list
		  if (searchList.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        if (!that.data.isFromSearch) {
          searchList=that.data.searchSongList.concat(searchList);
        } 
        that.setData({
          searchSongList: searchList, //获取数据数组
          searchLoading: true,   //把"上拉加载"的变量设为false，显示
          concurrentPrevention:true //防止多次发送请求
        });
		  } else {
        if (that.data.searchSongList.length <= 1){
          that.setData({
            searchSongList: searchList
          });
        }
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏
          });
		  }
	   }
    }
  })
  },
  //滚动到底部触发事件
  searchScrollLower: function(){
    let that = this;
    if(that.data.searchLoading && !that.data.searchLoadingComplete &&  that.data.concurrentPrevention){
      that.setData({
        searchPageNum: that.data.searchPageNum+1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false
		concurrentPrevention:false //防止多次发送请求
      });
      that.fetchSearchList();
    }
  },
  informationDts: function (option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../../detailspage/information-dts/information-dts';
    util.readingStatus(infoId, 'INFORMATION', url);
  },
   enterpriseDts: function (option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../../detailspage/enterprise-dts/enterprise-dts';
    util.readingStatus(infoId, util.commons_locale.enterpriseStore, url);
  },enterpriseResearchDts: function (option) {
    var infoId = option.currentTarget.dataset.infoid;
    var modelId = option.currentTarget.dataset.modelid;
    var nextUrl = '../../detailspage/enterprise-research-dts/enterprise-research-dts';
    var user = wx.getStorageSync('user') || {};
    var userMode = wx.getStorageSync('userMode') || {};
    wx.request({
      url: host + 'tpRecordcliReadingStatus/readingStatus.do',
      data: {
        modelId: infoId,
        modelType: util.commons_locale.enterprise_research,
        openid: user.openid
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function () {
        wx.navigateTo({
          url: nextUrl + '?modelId=' + infoId + '&&verifyFlage=' + userMode.verifyFlage + '&&openid=' + user.openid,
        })
      }
    })
  },
   industryResearchDts: function (option) {
    var infoId = option.currentTarget.dataset.infoid;
    var user = wx.getStorageSync('user') || {};
    var userId = wx.getStorageSync('userId') || '';
    var userMode = wx.getStorageSync('userMode') || {};
    if(userId != ''){
      that.setData({
        watermark: "background:url('" + watermarkurl + userId + "')"
      })
    }else{
      that.setData({
        // watermark: "background:url('" + watermarkurl + options.userId + "')"
      })
    }
    var url = '../../detailspage/industry-research-dts/industry-research-dts';
    wx.navigateTo({
      url: url + '?modelId=' + infoId + '&&verifyFlage=' + userMode.verifyFlage + '&&openid=' + user.openid,
    })
  }, onShow: function () {
     var userId = wx.getStorageSync('userId') || '';
    this.fetchSearchList();
    this.setData({
      // watermark: "background:url('" + watermarkurl+ userId + "')"
    })
  }
})