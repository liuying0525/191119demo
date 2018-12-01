var util = require('../../../../utils/util.js');
var home_item = require('../../../common/switchhomepage/home_item.js');
var menu = require('../../../common/menu/menu.js');
var host = require('../../../../config').host;
const watermarkurl = require('../../../../config.js').watermarkurl;

Page({
  data: {
    searchKeyword: '', //需要搜索的字符
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: util.system_val.page, // 设置加载的第几次，默认是第一次
    callbackcount: util.system_val.rows, //返回数据的个数
    searchLoading: false, //下拉加载，false默认显示
    searchLoadMore: true, //是否显示更多 false 表示没有更多
    screeningHidden: true, //筛选 默认true，隐藏
    concurrentPrevention: true, //防止多次发送请求
    prerequisite: '',
    parameter: {},
    inputModel: {
      industry: "",
      hotspot: "",
      registerPlace: ""
    },
    moduleCode: 'A', //右侧参数清单，参考allmenu.js
    placeholder: '全文关键字检索',
    loadingImg: util.picUrls.loading
  },
  fetchSearchList: function() {

    var that = this;
    var user = wx.getStorageSync('user') || {};
    var userMode = wx.getStorageSync('userMode') || {};
    let condition = {},
      parameter = {};
    condition.searchPageNum = that.data.searchPageNum;
    condition.url = host + "information/list.do";
    condition.callbackcount = that.data.callbackcount;
    parameter = that.data.parameter;
    parameter.inputVal = that.data.searchKeyword;
    parameter.prerequisite = that.data.prerequisite || "";

    util.getSearchMusic(condition, parameter, function(data) {
      util.pagingBottom(that, data); //分页底部状态切换
      let searchList = data.data.rows; //把取到的数组的值赋值给list
      var aPageNumber = (data.data.currentPage - 1) * that.data.callbackcount;
      var page = data.data.currentPage - 1;
      var d = {};
      var k = "searchSongList[" + page + "]";
      if (searchList.length != 0) {
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        // if (that.data.isFromSearch) {
        d[k] = home_item.getInforMationSearchList(data.data, aPageNumber);
        // } else {
        //   searchList = that.data.searchSongList.concat(home_item.getInforMationSearchList(data.data, aPageNumber));
        // }
        //debugger
        that.setData(d); //为了解决setdata数据长度限制的问题，小程序setData最多存储字符长度为1兆
        that.setData({
          concurrentPrevention: true, //防止多次发送请求
         // searchSongList: searchList //获取数据数组
        });
      }
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function(e) {
    this.setData({
      searchPageNum: 1, //第一次加载，设置1
      searchSongList: [], //放置返回数据的数组,设为空
      isFromSearch: true, //第一次加载，设置true
      searchLoading: false, //显示
      searchLoadMore: true,
      concurrentPrevention: true //防止多次发送请求
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件
  searchScrollLower: function() {
    let that = this;
    if (that.data.concurrentPrevention) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false, //触发到上拉事件，把isFromSearch设为为false
        concurrentPrevention: false, //防止多次发送请求
        searchLoading: false, //不显示不显示是true0   这里的true是不显示
        searchLoadMore: true //这个true是不显示
      });
      that.fetchSearchList();
    }
  },
  informationDts: function(option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../../detailspage/information-dts/information-dts';
    util.readingStatus(infoId, 'INFORMATION', url);
  },
  // 筛选
  screening: function(opt) {
    var that = this;
    var screeningHidden = false;
    if (!opt.currentTarget.dataset.screening) {
      screeningHidden = true;
    };
    menu.show(that, screeningHidden);
  },
  onLoad: function(option) {
    var that = this;
    var userId = wx.getStorageSync('userId') || '';
    menu.init(that);
    util.inintInput(that);
    if (option.title) {
      wx.setNavigationBarTitle({
        title: option.title,
      })
    }
    if (userId != '') {
      that.setData({
        prerequisite: option.prerequisite || "",
        watermark: "background:url('" + watermarkurl + userId + "')"
      })
    } else {
      that.setData({
        quisite: option.prerequisite || "",
         watermark: "background:url('" + watermarkurl + option.userId + "')"
      })
    }
  },
  onShow: function() {
    var that = this;
    that.fetchSearchList();
  }
})