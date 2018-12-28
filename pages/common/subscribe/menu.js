var allMenu = require('../../../utils/allMenu.js');
const host = require('../../../config').host;
module.exports = {
<<<<<<< HEAD
  init: function(obj) {
    allMenu.initMap(obj.data.moduleCode, host, function() {
      var checkedItem = obj.data.checkedItem;
      var vcheckedItem = {};
      //这里没有是否订阅和订阅周期
      var syncCheckedItem = wx.getStorageSync('subscribecheckedItem') || '';
      if (!checkedItem) {
        var user = wx.getStorageSync('user') || {};
        allMenu.getSubscribeData(host, user.openid).then(data => {
        
          vcheckedItem = JSON.parse(data.replace("辅料	", "辅料"));
          wx.setStorageSync('subscribecheckedItem', vcheckedItem); //缓存设置值，重新设置初始值，清空本地缓存
          obj.setData({
            dataOne: allMenu.getMenu(), //此处getMenu没有包含是否订阅及订阅周期菜单，需直接在wxml里写入
            getSubscribeData: vcheckedItem,
            checkedItem: vcheckedItem,
            menuOpen: {},
            screeningHidden: true,
            calendarIsShow: true
          });




          var selectedOneItem = {}
          let industryitems = obj.data.dataOne[0].items //从总菜单dataOne中取出行业菜单
          //进行循环判断每个一级菜单是否有被选择
          for (var i = 0; i < industryitems.length; i++) {
            if (isChildSelected(industryitems[i], obj.data.checkedItem)) {
              selectedOneItem[industryitems[i].id] = {
                "select": true,
                "name": industryitems[i].name
              } //把有选项的一级菜单id及name进行保存
            }
          }
          obj.setData({
            selectTopItem: selectedOneItem
          })
          //初始化结束

          clearCss(obj.data.checkedItem); //该函数作用未知


        });
      }
      // obj.setData({
      //   dataOne: allMenu.getMenu(), //此处getMenu没有包含是否订阅及订阅周期菜单，需直接在wxml里写入
      //   getSubscribeData: vcheckedItem,
      //   checkedItem: vcheckedItem,
      //   menuOpen: {},
      //   screeningHidden: true,
      //   calendarIsShow: true
      // });

      //初始化有多少一级行业选中
      //传入一个一级菜单节点及已被选中的item列表，判断该一级菜单下是否有被选择的子菜单
      function isChildSelected(menunode, selectedItem) {
        if (selectedItem[menunode.id]) {
          return true
        }
        if (menunode.items.length > 0) {
          for (var i = 0; i < menunode.items.length; i++) {
            if (isChildSelected(menunode.items[i], selectedItem)) {
              return true
            }
          }
        }
        return false
      }

      // var selectedOneItem = {}
      // let industryitems = obj.data.dataOne[0].items //从总菜单dataOne中取出行业菜单
      // //进行循环判断每个一级菜单是否有被选择
      // debugger
      // for (var i = 0; i < industryitems.length; i++) {
      //   if (isChildSelected(industryitems[i], obj.data.checkedItem)) {
      //     selectedOneItem[industryitems[i].id] = {
      //       "select": true,
      //       "name": industryitems[i].name
      //     } //把有选项的一级菜单id及name进行保存
      //   }
      // }
      // obj.setData({
      //   selectTopItem: selectedOneItem
      // })
      // //初始化结束

      // clearCss(obj.data.checkedItem); //该函数作用未知

      //当一个checkbox被点击时，进行展开或收缩
      obj.selectItem = function(e) {
        var closeItem = function(id) {
=======
  init: function (obj) {
    allMenu.customSubscribeDate(host,function(res){
      var syncCheckedItem = wx.getStorageSync('checkedItemSub') || '';
      let tm = res.tmCustomSubscribe
      let checkedItem = {}
      obj.setData({
        subscribeData:res,
        tmCustomSubscribe:tm,
        checkedSubscribe: syncCheckedItem,
        radioChangeObj:{},
        subscribeOpen: {},
        industryObj:{},
        industryHotspot:{},
        hotspotLength:0,
        industrylength:0,
        prnArrayObj:{},
        childrenItem:{},
        arrayName:[],
        prnArrayName:[],
        newPrnArrayName:[]
      });
      let industrylength = 0;
      let hotspotLength = 0;
      /*whetherSubscribe               是否订阅
      industry                                订阅行业id，逗号分割
      industryNames                    订阅行业名称，逗号分割
      hotspotSubdivideIds           热点细分id，逗号分割
      hotspotSubdivideNames    热点细分名称，逗号分割
      tradeScaleIds                       交易规模，逗号分割
      tradeScaleNames                交易规模名称，逗号分割
      equityChangeIds                 股权变动，逗号分割
      equityChangeNames          股权变动名称，逗号分割
      subscribeCycle                    订阅周期
      */
      
      let hotspotSubdivideIds = tm.hotspotSubdivideIds; //订阅热点
      let equityChangeIds = tm.equityChangeIds;   //股权变动
      let subscribeCycle = tm.subscribeCycle; //订阅周期
      let tradeScaleIds = tm.tradeScaleIds;   //交易规模
      let whetherSubscribe = tm.whetherSubscribe; //是否订阅

      let industry = tm.industry;  //行业数组

      let industryHotspotObj = {}
      let industryObj = {}
      let stockChangeObj = {}
      let radioChangeObj = {}
      let subscribeCycleObj = {}
      let tradeScaleObj = {}
      //radio
      if(!!industry){
        industry = industry.split(',')
        industrylength = industry.length;
        for(let i=0;i<industry.length;i++){
          industryObj['industry_'+ industry[i]] = true
        }
      }
      if(!!hotspotSubdivideIds){
        let hotArray = []
        hotspotSubdivideIds = hotspotSubdivideIds.split(',')
        hotspotLength = hotspotSubdivideIds.length
        for(let i=0;i<hotspotSubdivideIds.length;i++){
          industryHotspotObj['hot'+hotspotSubdivideIds[i] + '|' + tm.hotspotSubdivideNames.split(',')[i]] = true;
          hotArray.push(hotspotSubdivideIds[i] + '|' + tm.hotspotSubdivideNames.split(',')[i])
        }
        checkedItem['industryHotspot'] = hotArray.toString()
      }
      if(!!equityChangeIds){
        let equityArray = [];
        equityChangeIds = equityChangeIds.split(',')
        for(let i=0;i<equityChangeIds.length;i++){
          stockChangeObj['stock_'+ equityChangeIds[i] +'|' + tm.equityChangeNames.split(',')[i]] = true;
          equityArray.push(equityChangeIds[i] +'|' + tm.equityChangeNames.split(',')[i])
        }
        checkedItem['stockChange'] = equityArray.toString()
      }
      if(!!subscribeCycle){
        subscribeCycleObj['radio'] = subscribeCycle
        checkedItem['subscribeCycle'] = subscribeCycle
      }
      if(!!tradeScaleIds){
        let tradeArray = []
        tradeScaleIds = tradeScaleIds.split(',')
        for(let i=0;i<tradeScaleIds.length;i++){
          tradeScaleObj['trade_' + tradeScaleIds[i] + '|' + tm.tradeScaleNames.split(',')[i]] = true;
          tradeArray.push(tradeScaleIds[i] + '|' + tm.tradeScaleNames.split(',')[i])
        }
        checkedItem['tradeScale'] = tradeArray.toString()
      }
      if(!!whetherSubscribe){
        radioChangeObj['radio'] = whetherSubscribe
        checkedItem['whetherSubscribe'] = whetherSubscribe
      }
      obj.setData({
        checkedItem:checkedItem,
        industryObj:industryObj,
        stockChangeObj:stockChangeObj,
        industryHotspot:industryHotspotObj,
        radioChangeObj:radioChangeObj,
        subscribeCycleObj:subscribeCycleObj,
        tradeScaleObj:tradeScaleObj,
        industrylength:industrylength,
        hotspotLength:hotspotLength
      });
    })
    allMenu.initMap(obj.data.moduleCode,host,function(){
      var checkedItem = obj.data.checkedItem;
      var syncCheckedItem = wx.getStorageSync('checkedItemSub') || '';
      if (!checkedItem){
        if (syncCheckedItem != ''){
          checkedItem = syncCheckedItem;
        } else{
          checkedItem = {}//allMenu.getSettingData();
          wx.setStorageSync('checkedItemSub',checkedItem);//缓存设置值，重新设置初始值，清空本地缓存
        }  
      }
      obj.setData({
        dataOne: allMenu.getMenu(),
        subscribeData:allMenu.getSubscribe(),
        checkedItem: checkedItem,
        menuOpen: {},
        screeningHidden: true,
        calendarIsShow:true
      });
      clearCss(obj.data.checkedItem);
      
      obj.selectItemNews = function(e){
        let inspectItem = function (n) {
          let sub = obj.data.subscribeOpen;
          let haveItem = true;
          for(let key in sub){
            if(n == key){
              haveItem = false
              delete sub[key]
            }
          }
          if(haveItem){
            sub[n] = true
          }
          return sub
        };
        let sunitem = inspectItem(e.currentTarget.dataset.index);
        obj.setData({
          subscribeOpen: sunitem
        });
      };
      obj.selectItem = function (e) {
        var closeItem = function (id) {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
          if (mapMenu[id]) {
            obj.data.menuOpen[id] = false;
            for (var j = 0; j < mapMenu[id].length; j++) {
              closeItem(mapMenu[id][j]);
            }
<<<<<<< HEAD
          } else {
            obj.data.menuOpen[id] = false;
=======
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
          }
        };
        var mapMenu = allMenu.getMapMenu();
        var i = e.currentTarget.dataset.index;
        if (obj.data.menuOpen[i]) {
          closeItem(i);
          obj.setData({
            menuOpen: obj.data.menuOpen
          });
<<<<<<< HEAD

        } else if (mapMenu[i]) {

=======
        } else if (mapMenu[i]) {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
          for (var j = 0; j < mapMenu[i].length; j++) {
            obj.data.menuOpen[j] = true;
          }
          obj.data.menuOpen[i] = true;
          obj.setData({
            menuOpen: obj.data.menuOpen
          });
<<<<<<< HEAD
        } else {
          let menuOpen = obj.data.menuOpen
          menuOpen[i] = true
          obj.setData({
            menuOpen: menuOpen
          });
        }
      };


      obj.radioboxChange = function(e) {
        console.log(e)
        obj.data.checkedItem[e.currentTarget.dataset.index] = e.detail.value
        clearCss(obj.data.checkedItem);
      }
      //当一个checkbox状态被改变时，进行操作
      obj.checkboxChange = function(e) {
        let checkParent = {};
        var FLAG = true;
        var industrymenu = obj.data.dataOne[0].items
        var dataset = e.currentTarget.dataset;
        checkParent.checked = !obj.data.checkedItem[dataset.checked] ? true : false;
        checkParent.parentid = dataset.parentid;
        checkParent.parentids = dataset.parentids.split(',');
        checkParent.data = dataset.data;
        var inx; //这里是取得当前checkbox在数组中的index
        if (checkParent.parentids.length == 1) { //行业一级checkbox对应index被重命名为topidindex
          inx = dataset.topidindex
        } else {
          inx = dataset.index //二级，三级还是index
        }
        checkParent.items = dataset.data.items[inx];
        let dataset_checked = dataset.checked
        try {
          dataset_checked = dataset_checked.split('|')[0]
        } catch (err) {
          console.log(err)
          //document.getElementById("demo").innerHTML = err.message;
        }
        switch (dataset_checked) {
          case 'industry':
            if (!obj.data.checkedItem[dataset.checked] ? true : false) { //如果是当前状态是false，则是选中，检测顶级行业是否在已选择行业数组中
              var inselecttopitem = false
              if (obj.data.selectTopItem[dataset.topid]) { //直接在selectTopItem里找有没有对应的 topid元素
                inselecttopitem = true //如果有则说明该一级行业已经被选中
              }
              if (!inselecttopitem) { //如果没有在被选中列表 说明是一个新的行业
                var arry = Object.keys(obj.data.selectTopItem)
                if (arry.length >= 2) { //如果当前已选行业大于3个 则进行提示已超过3个，不进行任何操作
                  wx.showModal({
                    title: '提示',
                    content: '行业大类最多只能选择两个，如需要更多行业类别请联系墨领客服',
                    success: function(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else { //如果没有超过3个行业
                  obj.setData({ //此操作似乎无用
                    checked: !obj.data.checkedItem[dataset.checked] ? true : false
                  });
                  //把当前所点的checkbox所在一级行业菜单加入列表
                  obj.data.selectTopItem[dataset.topid] = {
                    "selected": true,
                    "name": industrymenu[dataset.topidindex].name
                  }
                  isChecked(checkParent); //递归是否有子菜单 进行复选
                  for (var i in checkParent.parentids) {
                    isCheckedParent(industrymenu, checkParent.parentids[i])
                  }
                }
              } else { //如果所点的checkbox的一级行业菜单已经在列表中，则无需再加入列表，直接复选子级菜单
                isChecked(checkParent);
              }
              for (var i in checkParent.parentids) {
                isCheckedParent(industrymenu, checkParent.parentids[i])
              }
            } else { //如果是取消，则直接复操作取消子级列表
              isChecked(checkParent);
              for (var i in checkParent.parentids) {
                isCheckedParent(industrymenu, checkParent.parentids[i])
              }

              //对该checkbox所在的行业菜单进行检查，是否完全为空，如果完全为空则从行业列表中去除
              if (!isChildSelected(industrymenu[dataset.topidindex], obj.data.checkedItem)) {
                delete(obj.data.selectTopItem[industrymenu[dataset.topidindex].id])
              }
            }
            break

          case "hotspot":
            if (!obj.data.checkedItem[dataset.checked] ? true : false) {
              let hotspotcount = 0
              for (var hsitem in obj.data.checkedItem) {
                if (hsitem.match("hotspot")) {
                  hotspotcount++
                }
              }
              if (hotspotcount >= 8) {
                wx.showModal({
                  title: '提示',
                  content: '热点细分最多只能选择八个，如需要更多细分类别请联系墨领客服',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
                break
              }
            }
            if (!obj.data.checkedItem[dataset.checked]) {
              obj.data.checkedItem[dataset.checked] = dataset.data.items[dataset.topidindex].name;
            } else {
              delete obj.data.checkedItem[dataset.checked]
            }
            break
          default:
            if (!obj.data.checkedItem[dataset.checked]) {
              obj.data.checkedItem[dataset.checked] = dataset.data.items[dataset.topidindex].name;
            } else {
              delete obj.data.checkedItem[dataset.checked]
            }
        }
        //刷新dataset 更新UI
        obj.setData({
          checkedItem: obj.data.checkedItem,
          selectTopItem: obj.data.selectTopItem
        });
        clearCss(obj.data.checkedItem);
      };

      //此函数是判断当所有的子菜单选中或清除时，其上级菜单自动选中或清除，此处未用
      function isCheckedParent(dataOne, parentid) {
        var FLAG = true;
        for (var j in dataOne) {
          if (dataOne[j].id == parentid) {
            for (var k in dataOne[j].items) {
              if (!obj.data.checkedItem[dataOne[j].items[k].id]) {
                FLAG = false;
              }
            }
            if (FLAG) obj.data.checkedItem[dataOne[j].id] = true;
            else obj.data.checkedItem[dataOne[j].id] = false;
          } else {
            isCheckedParent(dataOne[j].items, parentid);
          }
        }
      }
      //选择父子，子级全部选中||取消
      function isChecked(checkParent) {
        var items = checkParent.items;
        if (!checkParent.checked) {
          delete(obj.data.checkedItem[items.id])
        } else {
          obj.data.checkedItem[items.id] = items.name;
        }
        if (items.items.length > 0) {
          for (var i = 0; i < items.items.length; i++) {
            checkParent.items = items.items[i];
            isChecked(checkParent); //既然子item长度大于0，则必然有item，不需判断
          }
        }
      }

      //search函数此处未用
      obj.search = function() {
        var parameter = {
          'seached': 'Y'
        };
        if (obj.data.checkedItem) {
          for (var o in obj.data.checkedItem) {
            // if (o == 'industry|1')debugger;
            if (obj.data.checkedItem[o]) {
=======
        }
      };
      obj.radioChange = function (e) {
        let checkedItem = obj.data.checkedItem
        let dataset = e.currentTarget.dataset;
        let radioChangeObj = obj.data.radioChangeObj;
        let subscribeCycleObj = obj.data.subscribeCycleObj;
        let val = e.detail.value
        if(dataset.index == 'whetherSubscribe'){
          radioChangeObj['radio'] = val
        }

        if(dataset.index == 'subscribeCycle'){
          subscribeCycleObj['radio'] = val
        }
        
        checkedItem[dataset.index] = val
        //console.log(subscribeCycleObj,dataset.index)
        obj.setData({
          checkedItem: checkedItem,
          radioChangeObj:radioChangeObj,
          subscribeCycleObj:subscribeCycleObj
        })
      };

      obj.checkboxChange = function (e) {
        let checkParent = {}
        let FLAG = true;
        let inumber = 0;
        let checkedItem = obj.data.checkedItem
        let val = e.detail.value
        let industryHotspot = obj.data.industryHotspot;
        let stockChangeObj = obj.data.industryHotspot
        let tradeScaleObj = obj.data.tradeScaleObj
        let hotspotLength = 0;
        let dataset = e.currentTarget.dataset;
        if(dataset.index == 'industryHotspot'){
          industryHotspot = {}
          if(val.length > 8){
            wx.showModal({
              title: '错误',
              content: '订阅热点不能超过8个大类！',
              success: function(res) {}
            })
            return false
          }else{
            for(let i=0;i<val.length;i++){
              industryHotspot['hot' + val[i]] = true
            }
          }
        }

        if(dataset.index == 'stockChange'){
          stockChangeObj = {}
          for(let i=0;i<val.length;i++){
            stockChangeObj['stock_' + val[i]] = true
          }
        }

        if(dataset.index == 'tradeScale'){
          tradeScaleObj = {}
          for(let i=0;i<val.length;i++){
            tradeScaleObj['trade_' + val[i]] = true
          }
        }
        
        checkedItem[dataset.index] = val.toString()
        obj.setData({
          checkedItem: checkedItem,
          industryHotspot:industryHotspot,
          hotspotLength:val.length,
          stockChangeObj:stockChangeObj,
          tradeScaleObj:tradeScaleObj
        })
      };
      obj.childrenChanges = function(e){
        let val = e.detail.value
        let dataset = e.currentTarget.dataset
        let checkedItem = obj.data.checkedItem;
        let childrenItem = obj.data.childrenItem;
        let prnArrayObj = obj.data.prnArrayObj;
        let keyName = dataset.index + '_' + dataset.parentid;
        let industryObj = obj.data.industryObj;

        for(let i=0;i<val.length;i++){
          //let isbe = true;
          for(let key in prnArrayObj){
            let keyitem = key.split('_')[1]
            if(keyitem == dataset.parentid){
              delete prnArrayObj[key]
            }
          }
        }
        if(!!val.length){
          for(let i=0;i<val.length;i++){
            prnArrayObj[keyName + '_' + val[i]] = true;
          }
        }
        if(!!val.length){
          childrenItem[keyName] = true;
        }else{
          for(let key in prnArrayObj){
            let keyitem = key.split('_')[1]
            if(keyitem == dataset.parentid){
              delete prnArrayObj[key]
            }
          }
          for(let key in childrenItem){
            if(key == keyName){
              delete childrenItem[keyName]
              delete industryObj[keyName]
            }
          }
        }
        checkedItem[dataset.index + '_' + dataset.parentid] = val.toString();
        obj.setData({
          checkedItem:checkedItem,
          childrenItem:Object.assign(industryObj,childrenItem),
          industrylength:objIsNumber(Object.assign(industryObj,childrenItem)),
          prnArrayObj:prnArrayObj
        })
      };
      
      obj.industryClick = function(e){
        let dataset = e.currentTarget.dataset;
        isChecked(dataset)
        /*if(dataset.checked === false){
          
        }else{
          
        }*/
      };
      //选择父子，子级全部选中||取消
      function isChecked(val,dataset) {
        let sArr = new Array;
        let sObj = new Object();
        let prnArray = obj.data.prnArrayObj;
        let checkedItem = obj.data.checkedItem;
        for(let i=0;i<val.length;i++){
          for(let di=0;di<dataset.length;di++){
            if(val[i].split('|')[0] == dataset[di].id){
              //children
              sObj['children_' + dataset[di].id] = dataset[di].children
            }
          }
        }
        for(let key in checkedItem){
          if(key.indexOf('industry_') != -1){
            delete checkedItem[key]
          }
        }
        for(let key in prnArray){
          if(key.indexOf('industry_') != -1){
            delete prnArray[key]
          }
        }
        
        for(let key in sObj){
          let dataset_id = key.split('_')[1]
          
          for(let i=0;i<sObj[key].length;i++){
            prnArray['industry_' + dataset_id + '_' + sObj[key][i].id] = true;
            sArr.push(sObj[key][i].id + '|' + sObj[key][i].text)
          }
          checkedItem['industry_' + dataset_id] = sArr.toString();
        }
        console.log(prnArray)
        obj.setData({
          prnArrayObj: prnArray,
          checkedItem:checkedItem
        })
      };
      obj.industryChange = function(e){
        let dataset = e.currentTarget.dataset;
        //isChecked
        //console.log(dataset)
        let val = e.detail.value;
        let industryObj = {};
        let childrenItem = obj.data.childrenItem
        let checkedItem = obj.data.checkedItem;
        if(val.length > 3){
          wx.showModal({
            title: '错误',
            content: '订阅行业不能超过3个大类！',
            success: function(res) {}
          })
          return false;
        }
        for(let i=0;i<val.length;i++){
          industryObj['industry_' + val[i]] = true;
        }
        isChecked(val,dataset.data)
        checkedItem['industry'] = val.toString()
        if(val.length == 0){
          delete checkedItem['industry']
        }
        //console.log(val.toString())
        //isChecked(e)
        obj.setData({
          checkedItem: checkedItem,
          industryObj:industryObj,
          industrylength:val.length
        })
      };

      obj.checkboxChanges = function (e) {
        let dataset = e.currentTarget.dataset;
        let checkParent = {}
        checkParent.checked = !obj.data.checkedItem[dataset.checked] ? true : false;
        checkParent.parentid = dataset.parentid;
		    checkParent.parentids = dataset.parentids.split(',');
        checkParent.data = dataset.data;
        checkParent.items = dataset.data.children[dataset.index];
        for(var i in  checkParent.parentids){
          isCheckedParent(obj.data.subscribeData,checkParent.parentids[i])
        }
      };

      function objIsNumber(obj) {
        let num = 0
        for(var key in obj) {
          num++
        }
        return num;
      }

      function unique(arr){
      　　var res = [arr[0]];
      　　for(var i=1;i<arr.length;i++){
      　　　　var repeat = false;
      　　　　for(var j=0;j<res.length;j++){
      　　　　　　if(arr[i] == res[j]){
      　　　　　　　　repeat = true;
      　　　　　　　　break;
      　　　　　　}
      　　　　}
      　　　　if(!repeat){
      　　　　　　res.push(arr[i]);
      　　　　}
      　　}
      　　return res;
      }

      function isCheckedParent(a,b){
        var FLAG = true;
        let checkedItem = obj.data.checkedItem
        for(let key in checkedItem){
          let industry = 'industry|' + b
          if(industry === key){
            FLAG = false;
          }
        }
        if(!FLAG){
          delete obj.data.checkedItem['industry|'+b];
        }else{
          obj.data.checkedItem['industry|'+b] = true;
        }
      }
      obj.search = function () {
        console.log(obj.data.checkedItem)
        var parameter={'seached':'Y'};   
        if (obj.data.checkedItem){
          for (var o in obj.data.checkedItem){
            if (obj.data.checkedItem[o]){
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
              var arr = o.split('|');
              if (parameter[arr[0]] != undefined) {
                if (parameter[arr[0]] instanceof Array) {
                  parameter[arr[0]].push(arr[1]);
                } else {
                  parameter[arr[0]] = [parameter[arr[0]], arr[1]];
                }
              } else {
                parameter[arr[0]] = arr[1];
              }
<<<<<<< HEAD
            }
          }
        }
        var module_data = allMenu.module_data[obj.data.moduleCode];
        var changeParameter = {
          'seached': 'Y'
        };

        for (var para in parameter) {
          for (var code in module_data) {
            if (module_data[code] == para) {
              changeParameter[para] = parameter[para];
            }
=======
            } 
           }
        }
        var module_data = allMenu.module_data[obj.data.moduleCode];
        var changeParameter = { 'seached': 'Y' };  
      
          for (var para in parameter){
            for (var code in module_data) {
              if (module_data[code] == para) {
                changeParameter[para] = parameter[para];
              }
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
          }
        }
        obj.setData({
          parameter: changeParameter,
          screeningHidden: true
        });
<<<<<<< HEAD
        obj.keywordSearch();
      };
      obj.clear = function() {
        var user = wx.getStorageSync('user') || {};
        obj.setData({
          subscribeOpen: {},
          checkedItem: {},
          parameter: {},
          expectedTimeOne: '',
          expectedTimeOneTwo: '',
          subscribeData: allMenu.getSubscribeData(host,user.openid),
          industryObj: {},
          industryHotspot: {},
          tradeScaleObj: {},
          stockChangeObj: {}
        });
        clearCss(obj.data.checkedItem);
      };

      //该函数作用未知
      function clearCss(checkedItem) {
        var FLAG = false;
        for (var i in checkedItem) {
          if (checkedItem[i]) {
            FLAG = true;
            break
          }
        }
        if (!FLAG) {
          obj.setData({
            ocs_clear: 'clearMortar'
          })
        } else {
          obj.setData({
            ocs_clear: ''
          })
        }
=======
        /*obj.keywordSearch();*/
        
        //obj.doSaveSetting()
      };
      obj.clear = function () {
        obj.setData({
          checkedItem: {},
          parameter:{},
          expectedTimeOne: '',
          expectedTimeOneTwo: ''
        });
        clearCss(obj.data.checkedItem);
      };
      function clearCss(checkedItem){
        var FLAG= false;
        for (var i in checkedItem){
          if (checkedItem[i]){
            FLAG=true;
            break
          }
        }
        if (!FLAG){
          obj.setData({
            ocs_clear:'clearMortar'
          })
        }else{
          obj.setData({
            ocs_clear: ''
          })
        } 
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      }
      // if (!obj.data.setting){
      //   obj.search();
      // }
    });
<<<<<<< HEAD
  },
  show: function(obj, screeningHidden) {
    obj.setData({
      screeningHidden: screeningHidden
    });
  },
  getAllMenu: function() {
    return allMenu;
  }
}
=======
  }, show: function (obj, screeningHidden){
    obj.setData({
      screeningHidden: screeningHidden
    });
  },getAllMenu:function(){
    return allMenu;
  }
}
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
