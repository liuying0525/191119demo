var allMenu = require('../../../utils/allMenu.js');
const host = require('../../../config').host;
module.exports = {
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
          if (mapMenu[id]) {
            obj.data.menuOpen[id] = false;
            for (var j = 0; j < mapMenu[id].length; j++) {
              closeItem(mapMenu[id][j]);
            }
          } else {
            obj.data.menuOpen[id] = false;
          }
        };
        var mapMenu = allMenu.getMapMenu();
        var i = e.currentTarget.dataset.index;
        if (obj.data.menuOpen[i]) {
          closeItem(i);
          obj.setData({
            menuOpen: obj.data.menuOpen
          });

        } else if (mapMenu[i]) {

          for (var j = 0; j < mapMenu[i].length; j++) {
            obj.data.menuOpen[j] = true;
          }
          obj.data.menuOpen[i] = true;
          obj.setData({
            menuOpen: obj.data.menuOpen
          });
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
          }
        }
        obj.setData({
          parameter: changeParameter,
          screeningHidden: true
        });
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
      }
      // if (!obj.data.setting){
      //   obj.search();
      // }
    });
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