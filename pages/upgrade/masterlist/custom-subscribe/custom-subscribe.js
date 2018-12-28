<<<<<<< HEAD
// pages/upgrade/masterlist/setting.js
=======
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
const host = require('../../../../config').host;
var menu = require('../../../common/subscribe/menu.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< HEAD
    setting: true,
    parameter: {},
    moduleCode: 'H' //右侧参数清单，参考allmenu.js
=======
    setting:true,
    parameter: {},
    moduleCode: 'G'//右侧参数清单，参考allmenu.js
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
  },

  /**
   * 生命周期函数--监听页面加载
   */
<<<<<<< HEAD
  onLoad: function(options) {
    var me = this;
    menu.init(me);
  },
  keywordSearch: function() {
    var me = this;
    var user = wx.getStorageSync('user') || {};
    var data = me.data.checkedItem;
    wx.request({
      url: host + 'customSubscribe/setting.do',
      data: {
        'openId': user.openid,
        'json': JSON.stringify(data)
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (data.hasOwnProperty("whetherSubscribe") && data["whetherSubscribe"] == "YES") {
            wx.showModal({
              title: '订阅成功',
              content: res.data.msg || '您已经成功订阅',
            })
          }
          wx.setStorageSync('subscribecheckedItem', data);
          setTimeout(function() {
            wx.reLaunch({
              url: '../../../homepage/homepage?templet=information&pagePath=information/list.do&userId=' + user
            });
          }, 1500);

        } else {
          wx.showModal({
            title: '请求失败',
            content: res.errMsg,
          })
        }
      },
      fail: function(error) {
        wx.showModal({
          title: '请求失败',
          content: error.errMsg,
        })
      }
    })

  }
=======
  onLoad: function (options) {
    var me = this;
    menu.init(me);
    me.setData({
      pagePath: options.pagePath,
      moduleCode: options.moduleCode
    });
  },
    doSaveSetting:function(){
        var me=this;
        var data = me.data.checkedItem;
        let hotspotSubdivideIds = [];
        let hotspotSubdivideNames = [];
        let equityChangeIds = [];
        let equityChangeNames = []
        let tradeScaleIds = [];
        let tradeScaleNames = [];
        if(!!data.industryHotspot){
          let hotdata = data.industryHotspot
          hotdata = hotdata.split(',')
          console.log(hotdata)
          for(let i=0;i<hotdata.length;i++){
            hotspotSubdivideIds.push(hotdata[i].split('|')[0])
            hotspotSubdivideNames.push(hotdata[i].split('|')[1])
          }
          data.hotspotSubdivideIds = hotspotSubdivideIds.toString()
          data.hotspotSubdivideNames = hotspotSubdivideNames.toString()
          delete data['industryHotspot']
        }
        if(!!data.stockChange){
          let stockdata = data.stockChange
          stockdata = stockdata.split(',')
          console.log(stockdata)
          for(let i=0;i<stockdata.length;i++){
            equityChangeIds.push(stockdata[i].split('|')[0])
            equityChangeNames.push(stockdata[i].split('|')[1])
          }
          data.equityChangeIds = equityChangeIds.toString()
          data.equityChangeNames = equityChangeNames.toString()
          delete data['stockChange']
        }
        if(!!data.tradeScale){
          let tradedata = data.tradeScale
          tradedata = tradedata.split(',')
          console.log(tradedata)
          for(let i=0;i<tradedata.length;i++){
            tradeScaleIds.push(tradedata[i].split('|')[0])
            tradeScaleNames.push(tradedata[i].split('|')[1])
          }
          data.tradeScaleIds = tradeScaleIds.toString()
          data.tradeScaleNames = tradeScaleNames.toString()
          delete data['tradeScale']
        }
        var user = wx.getStorageSync('user') || {};
        data.openId = user.openid
        wx.removeStorageSync('checkedItemSub');
        //ajax,请求
        wx.request({
            url: host + 'customSubscribe/setting.do',
            data: data,
            method: 'post',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    wx.showModal({
                        title: '订阅成功',
                        content: res.data.msg || '您已经成功订阅',
                    })
                    wx.reLaunch({
                      url: '../../../homepage/homepage?templet=information&pagePath=information/list.do'
                    });
                }else{
                    wx.showModal({
                        title: '请求失败',
                        content: res.errMsg,
                      })
                }
            },
            fail: function (error) {
              wx.showModal({
                title: '请求失败',
                content: error.errMsg,
              })
            }
        })
    }
 /*keywordSearch:function(){
      var me=this;
      var data = me.data.checkedItem;
      wx.removeStorageSync('checkedItem');
      menu.getAllMenu().updateSettingData(host,data,function(){
        wx.reLaunch({
          url: '../../../homepage/homepage?templet=' + me.data.moduleCode + '&pagePath=' + me.data.pagePath
        });
      });
      
  }*/
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
})