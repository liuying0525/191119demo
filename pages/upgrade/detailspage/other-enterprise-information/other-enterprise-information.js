var util = require('../../../../utils/util.js');
var home_item = require('../../../common/switchhomepage/home_item.js');
const host = require('../../../../config').host;
Page({
  data: {
    searchKeyword: '',  //需要搜索的字符
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 15,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    screeningHidden:true, //筛选 默认true，隐藏
  	concurrentPrevention:true, //防止多次发送请求
	  enterpriseId:''
  },
  //输入框事件，每输入一个字符，就会触发一次
  bindKeywordInput: function(e){
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //搜索，访问网络
  fetchSearchList: function(){
	var user = wx.getStorageSync('user') || {};
    var userMode = wx.getStorageSync('userMode') || {};
    let that = this;
    let searchKeyword =  that.data.searchKeyword,//输入框字符串作为参数
        searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
		url=host+"information/theEnterpriseList.do",
        callbackcount =that.data.callbackcount; //返回数据的个数
	let condition= {};
	condition.searchPageNum	= searchPageNum;
	condition.url = url;
	condition.callbackcount	= callbackcount;
  let parameter = {};
    parameter.inputVal = searchKeyword;
	parameter.enterpriseId = that.data.enterpriseId;
    //访问网络
    util.getSearchMusic(condition, parameter, function (data) {
      //判断是否有数据，有则取数据
      let searchList = searchList = data.data.rows; //把取到的数组的值赋值给list
      var aPageNumber = (data.data.currentPage - 1) * that.data.callbackcount;
      if (searchList.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        if (that.data.isFromSearch) {
          searchList = home_item.getInforMationSearchList(data.data, aPageNumber);
        } else {
          searchList = that.data.searchSongList.concat(home_item.getInforMationSearchList(data.data, aPageNumber));
        }
        that.setData({
          searchSongList: searchList, //获取数据数组
          searchLoading: true,   //把"上拉加载"的变量设为false，显示
		  concurrentPrevention:true //防止多次发送请求
        });
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏
        });
      }
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function(e){
    this.setData({  
      searchPageNum: 1,   //第一次加载，设置1
      searchSongList:[],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示
      searchLoadingComplete:false, //把“没有数据”设为false，隐藏
	    concurrentPrevention:true //防止多次发送请求
    })
    this.fetchSearchList();
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
  onShow: function () {
   this.fetchSearchList();
  },
  onLoad: function (option){
    var that = this;
    that.setData({
		  enterpriseId:option.enterprise
	  })
  },
  informationDts: function (option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../information-dts/information-dts';
    util.readingStatus(infoId, 'INFORMATION', url);
  },
  // 筛选
  screening:function(opt){
    var that = this;
    var screeningHidden = false;
    if (!opt.currentTarget.dataset.screening){
      screeningHidden = true;
    }
    that.setData({
      screeningHidden: screeningHidden
    })
  }
})