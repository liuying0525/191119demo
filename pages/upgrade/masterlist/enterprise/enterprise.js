var util = require('../../../../utils/util.js');
const watermarkurl = require('../../../../config.js').watermarkurl;
var home_item = require('../../../common/switchhomepage/home_item.js');
var menu = require('../../../common/menu/menu.js');
const host = require('../../../../config').host;
Page({
  data: {
    searchKeyword: '', //需要搜索的字符
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: util.commons_locale.page, // 设置加载的第几次，默认是第一次
    callbackcount: util.commons_locale.rows, //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false,显示
    concurrentPrevention: true, //防止多次发送请求
    screeningHidden: true, //筛选 默认true，隐藏
    parameter: {},
    moduleCode: 'B', //右侧参数清单，参考allmenu.js
    placeholder: '企业名称或品牌检索',
    loadingImg: util.picUrls.loading,
    customNeeds: true,
    searchLoadMore: true,
    inputModel: {
      industry: "",
      hotspot: "",
      registerPlace: ""
    }
  },
  fetchSearchList: function() {
    let that = this;
    let condition = {},
      parameter = {};
    condition.searchPageNum = that.data.searchPageNum, //把第几次加载次数作为参数
      condition.url = host + "enterprise/list.do";
    condition.callbackcount = that.data.callbackcount; //返回数据的个数
    parameter = that.data.parameter;
    parameter.inputVal = that.data.searchKeyword, //输入框字符串作为参数
      util.getSearchMusic(condition, parameter, function(data) {
        util.pagingBottom(that, data); //分页底部状态切换
        let searchList = searchList = data.data.rows; //把取到的数组的值赋值给list
        var aPageNumber = (data.data.currentPage - 1) * that.data.callbackcount;
        var page = data.data.currentPage - 1;
     
        var d = {};
        var k = "searchSongList[" + page + "]";
        if (searchList.length != 0) {
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
          // if (that.data.isFromSearch) {
          d[k] = home_item.getEnterpriseSearchList(data.data, aPageNumber);
          // } else {
          //   searchList = that.data.searchSongList.concat(home_item.getEnterpriseSearchList(data.data, aPageNumber));
          // }

          that.setData(d);
          that.setData({
            // searchSongList: searchList, //获取数据数组
            concurrentPrevention: true
          });
        } else {
          that.setData({
            customNeeds: false
          })
        }
      })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function(e) {
    this.setData({
      searchPageNum: 1, //第一次加载，设置1
      searchSongList: [], //放置返回数据的数组,设为空
      isFromSearch: true, //第一次加载，设置true
      searchLoading: false, //"上拉加载"的变量，默认false,显示
      concurrentPrevention: true,
      searchLoadMore: true
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件
  searchScrollLower: function() {
    
    let that = this;
    if (that.data.concurrentPrevention) {
      that.setData({
        concurrentPrevention: false,
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        searchLoading: false, //"上拉加载"的变量，默认false,显示
        isFromSearch: false, //触发到上拉事件，把isFromSearch设为为false
     searchLoadMore: true
      });
      that.fetchSearchList();
      // if(curPage==0){
      //   that.setData({
      //     concurrentPrevention: false,})
      // }
    }
  },
  enterpriseDts: function(option) {
    var infoId = option.currentTarget.dataset.infoid;
    var url = '../../detailspage/enterprise-dts/enterprise-dts';
    util.readingStatus(infoId, util.commons_locale.enterpriseStore, url);
  }, // 筛选
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
    if (userId != '') {
      that.setData({
        watermark: "background:url('" + watermarkurl + userId + "')"
      })
    } else {
      that.setData({
        watermark: "background:url('" + watermarkurl + option.userId + "')"
      })
    }
    menu.init(that);
    util.inintInput(that);
  },
  onShow: function() {
   this.fetchSearchList();

  },
  newCustomTo: function() {
    wx.redirectTo({
      url: '../../detailspage/newcustom/newcustom?enterpriseCustom=' + '关于企业搜索无结果的定制需求：',
    })
  }

})