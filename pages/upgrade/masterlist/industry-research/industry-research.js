var util = require('../../../../utils/util.js');
const watermarkurl = require('../../../../config.js').watermarkurl;
var home_item = require('../../../common/switchhomepage/home_item.js');
const host = require('../../../../config').host;
var menu = require('../../../common/menu/menu.js');
Page({
  data: {
    searchKeyword: '',  //需要搜索的字符
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: util.commons_locale.page,   // 设置加载的第几次，默认是第一次
    callbackcount: util.commons_locale.rows,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    concurrentPrevention: true, //防止多次发送请求
    screeningHidden: true, //筛选 默认true，隐藏
	  prerequisite:'',
    parameter: {},
    moduleCode: 'D',//右侧参数清单，参考allmenu.js
    loadingImg: util.picUrls.loading,
    inputModel: {
      industry: "",
      hotspot: "",
      registerPlace: ""
    }
  },
  //搜索，访问网络
  fetchSearchList: function () {
    let that = this;
    let condition = {}, parameter={};
    condition.searchPageNum = that.data.searchPageNum;
    condition.url = host + "industryResearch/list.do";
    condition.callbackcount = that.data.callbackcount;
    parameter = that.data.parameter;
    parameter.reportName = that.data.searchKeyword;
	  parameter.prerequisite = that.data.prerequisite;
    util.getSearchMusic(condition, parameter, function (data) {
      util.pagingBottom(that, data);//分页底部状态切换
      let searchList = searchList = data.data.rows; //把取到的数组的值赋值给list
      var aPageNumber = (data.data.currentPage - 1) * that.data.callbackcount;
      var page = data.data.currentPage - 1;
      var d = {};
      var k = "searchSongList[" + page + "]";
      if (searchList.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        // if (that.data.isFromSearch) {
          d[k] = home_item.getIndustryResearchSearchList(data.data.rows, aPageNumber);
        // } else {
        //   searchList = that.data.searchSongList.concat(home_item.getIndustryResearchSearchList(data.data.rows, aPageNumber));
        // }
        that.setData(d);
        that.setData({
          concurrentPrevention: true//防止多次发起请求
          // searchSongList: searchList //获取数据数组
        });
      }
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function (e) {
    var that = this;
    that.setData({
      searchPageNum: 1,   //第一次加载，设置1
      searchSongList: [],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: false,  //显示
      concurrentPrevention: true //防止多次发送请求
    })
    that.fetchSearchList();
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    var that = this;
    if (that.data.concurrentPrevention) {
        that.setData({
          concurrentPrevention: false,
          searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
          isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false
          searchLoading: false  //显示
        });
        that.fetchSearchList();
    }
  },
  industryResearchDts: function (option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../../detailspage/industry-research-dts/industry-research-dts';
    util.readingStatus(infoId, util.commons_locale.industry_research, url);
  },
  onLoad: function (option){
    var that = this;
    menu.init(that);
    util.inintInput(that);
    var userId = wx.getStorageSync('userId') || '';
    if (userId != '') {
      that.setData({
        prerequisite: option.prerequisite||"",
         watermark: "background:url('" + watermarkurl+ userId + "')"
      })
    } else {
      that.setData({
        prerequisite: option.prerequisite||"",
        watermark: "background:url('" + watermarkurl + option.userId + "')"
      })
    }
  }, // 筛选
  screening: function (opt) {
    var that = this;
    var screeningHidden = false;
    if (!opt.currentTarget.dataset.screening) {
      screeningHidden = true;
    };
    menu.show(that, screeningHidden);
  },onShow: function () {
    var that = this;
    that.fetchSearchList();
  }

})