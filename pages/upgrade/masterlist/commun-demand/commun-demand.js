var util = require('../../../../utils/util.js');
 const watermarkurl = require('../../../../config.js').watermarkurl;
var home_item = require('../../../common/switchhomepage/home_item.js');
var menu = require('../../../common/menu/menu.js');
const host = require('../../../../config').host;
var calendar = require('../../../common/calendar/calendar.js');
Page({
  data: {
    searchKeyword: '',  //需要搜索的字符
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum:util.system_val.page,   // 设置加载的第几次，默认是第一次
    callbackcount:util.system_val.rows,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
	  concurrentPrevention:true, //防止多次发送请求
    screeningHidden: true, //筛选 默认true，隐藏
    parameter: {},
    moduleCode: 'E',//右侧参数清单，参考allmenu.js
    timeHidden:true,
    calendarIsShow:true,
    expectedTimeOne: '',
    expectedTimeOneTwo: '',
    loadingImg: util.picUrls.loading
  },
  //搜索，访问网络
  fetchSearchList: function(){
    let condition = {}, parameter = {}, that = this;
        condition.searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
        condition.url = host + "demand/list.do";
        condition.callbackcount = that.data.callbackcount; //返回数据的个数
        parameter = that.data.parameter;
        parameter.companyName = that.data.searchKeyword,//输入框字符串作为参数
        parameter.expectedTimeOne = that.data.expectedTimeOne;
        parameter.expectedTimeOneTwo = that.data.expectedTimeOneTwo;
    util.getSearchMusic(condition, parameter, function (resData) {
      util.pagingBottom(that, resData);//分页底部状态切换
        let searchList = resData.data.rows; //把取到的数组的值赋值给list
        var page = resData.data.currentPage - 1;
        var d = {};
        var k = "searchSongList[" + page + "]";
         if (searchList.length != 0) {
              d[k] = home_item.getCommunSearchList(resData.data,that);
          that.setData(d);
          that.setData({
            concurrentPrevention:true //防止多次发送请求
          });
      }
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function(e){
    var that = this;
    that.setData({  
      searchPageNum: 1,   //第一次加载，设置1
      searchSongList:[],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: false  //把"上拉加载"的变量设为true，显示
    })
    that.fetchSearchList();
  },
  //滚动到底部触发事件
  searchScrollLower: function(){
    var that = this;
    if(that.data.concurrentPrevention){
      that.setData({
	    	concurrentPrevention:false, //防止多次发送请求
        searchPageNum: that.data.searchPageNum+1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false
        searchLoading: false  //把"上拉加载"的变量设为true，显示
      });
      that.fetchSearchList();
    }
  },
  expectedTimeOne: function (e) {
    var that = this;
    var calendarIsShow = true;
    if (that.data.key == 'expectedTimeOne') {
      calendarIsShow = that.data.calendarIsShow ? false : true
    } else {
      calendarIsShow = false;
    }
    that.setData({
      key: e.currentTarget.dataset.key,
      top: e.detail.y + 15,
      calendarIsShow: calendarIsShow,
      total:true
    })
    calendar.inintcalendar(that);
  },
  expectedTimeOneTwo: function (e) {
    var that = this;
    var calendarIsShow = true;
    if (that.data.key == 'expectedTimeOneTwo') {
      calendarIsShow = that.data.calendarIsShow ? false : true
    } else {
      calendarIsShow = false;
    }
    that.setData({
      key: e.currentTarget.dataset.key,
      top: e.detail.y + 15,
      calendarIsShow: calendarIsShow,
      total: true
    })
    calendar.inintcalendar(that);
  },
  // 筛选
  screening: function (opt) {
    var that = this;
    var screeningHidden = false;
    if (!opt.currentTarget.dataset.screening) {
      screeningHidden = true;
    };
    menu.show(that, screeningHidden);
  },
  onLoad: function (option) {
    var that = this;
    var userId = wx.getStorageSync('userId') || '';
    menu.init(that);
    util.inintInput(that);
    if(userId != ''){
      that.setData({
         watermark: "background:url('" + watermarkurl + userId + "')"
      })
    }else{
      that.setData({
         watermark: "background:url('" + watermarkurl+ options.userId + "')"
      })
    }
  }, onShow: function () {
    var that = this;
    that.fetchSearchList();
  }
})