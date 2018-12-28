var allMenu = require('../../../utils/allMenu.js');
const host = require('../../../config').host;
var util = require('../../../utils/util.js')
module.exports = {
  init: function(obj) {
<<<<<<< HEAD
    var that = this; //obj.data.moduleCode == "A" ? "ALL" : 
=======
    var that = this;//obj.data.moduleCode == "A" ? "ALL" : 
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    allMenu.initMap(obj.data.moduleCode, host, function() {
      var checkedItem = obj.data.checkedItem;
      var syncCheckedItem = wx.getStorageSync('checkedItem') || '';
      if (!checkedItem) {
        if (syncCheckedItem != '') {
          checkedItem = syncCheckedItem;
        } else {
          checkedItem = allMenu.getSettingData();
          wx.setStorageSync('checkedItem', checkedItem); //缓存设置值，重新设置初始值，清空本地缓存
        }
      }

<<<<<<< HEAD

=======
      
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      obj.setData({
        dataOne: allMenu.getMenu(),
        checkedItem: checkedItem,
        menuOpen: {},
        screeningHidden: true,
        calendarIsShow: true
      });
      clearCss(obj.data.checkedItem);
      obj.selectItem = function(e) {
        var closeItem = function(id) {
          if (mapMenu[id]) {
            obj.data.menuOpen[id] = false;
            for (var j = 0; j < mapMenu[id].length; j++) {
              closeItem(mapMenu[id][j]);
            }
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
        }

        obj.bindKeyInput = function(event) {
<<<<<<< HEAD
          var FLAG = false;
=======
          var FLAG=false;
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
          var txtValue = event.detail.value.trim();
          txtValue = txtValue;
          var imodel = obj.data.inputModel;
          imodel[event.currentTarget.dataset.mtype] = txtValue;
          obj.setData({
            menuKeyword: txtValue,
            inputModel: imodel
          });
<<<<<<< HEAD
          if (txtValue.length > 0) {
            FLAG = true;
=======
          if(txtValue.length>0){
           FLAG=true;
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
            if (!FLAG) {
              obj.setData({
                ocs_clear: 'clearMortar'
              })
            } else {
              obj.setData({
                ocs_clear: ''
              })
            }
<<<<<<< HEAD
          } else {
            FLAG = false;
=======
          }else{
            FLAG=false;
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
          }
          var sid = event.currentTarget.dataset.index;
          var nData = obj.data.dataOne.filter(a => a.id == sid);
          if (nData.length == 0) return;
          var nDataList = nData = nData[0];
          var allItems = [];
          //debugger
          // nDataList.items.forEach((item, index) => {
          //   setSearchObject(item, 1);
          // });
          if (txtValue.length == 0) {
            nDataList.items.forEach((item, index) => {
              setSearchObject(item, 1);
            });
          } else {
            var nDataObj = 0;
            nDataList.items.forEach((item, index) => {
              getSearchObject(nDataList, nDataList, item, txtValue, nDataObj, allItems);
            });
          }
          nDataList.items.forEach((item, index) => {
            if (allItems.indexOf(item.id) != -1) {
              item.isShow = 1;
            }
          });
          obj.data.dataOne.filter(a => a.id == sid)[0] = nDataList;
          obj.setData({
            dataOne: obj.data.dataOne
          });
          setTimeout(() => {
            obj.data.menuOpen[e.currentTarget.dataset.index] = true;
            obj.setData({
              menuOpen: obj.data.menuOpen
            })
          }, 100);
        }
      };

      function getSearchObject(aitem, pitem, item, searchName, isShow = 0, arrasys) {
        // if (item.name.indexOf(searchName) != -1 || item.name.toLowerCase().indexOf(searchName) != -1 || item.name.indexOf(searchName.toLowerCase()) != -1) {
        if (item.name.toLowerCase().indexOf(searchName.toLowerCase()) != -1) {
          isShow = 1;
        } else {
          isShow = 0;
        }
        if (isShow == 0) {
          // if (item.items.filter(o => o.name.indexOf(searchName) != -1 || o.name.toLowerCase().indexOf(searchName) != -1 || o.name.indexOf(searchNam.toLowerCase()) != -1 ).length > 0) {
          if (item.items.filter(o => o.name.indexOf(searchName) != -1 || o.name.toLowerCase().indexOf(searchName.toLowerCase()) != -1).length > 0) {
            isShow = 1;
          }
        }
        item.items.forEach(obj => {
          getSearchObject(aitem, item, obj, searchName, isShow, arrasys);
        });
        if (isShow == 1) //找父节点
        {
          pitem.isShow = 1;
          for (var v = 0; v < aitem.items.length; v++) {
            for (var m = 0; m < aitem.items[v].items.length; m++) {
              if (aitem.items[v].items[m].name == pitem.name) {
                aitem.items[v].isShow = 1;
                var keyName = aitem.items[v].id;
                arrasys.indexOf(keyName) == -1 && (arrasys.push(keyName));
                setTimeout(() => {
                  obj.data.menuOpen[keyName] = true;
                  obj.setData({
                    menuOpen: obj.data.menuOpen
                  });
                }, 150);
              }
            }
          }
        }
        item.isShow = isShow;
        if (isShow) {
          setTimeout(() => {
            obj.data.menuOpen[item.id] = true;
          }, 50);
        }
      };

      function setSearchObject(item, isShow) {

        item.items.forEach(obj => {
          setSearchObject(obj, isShow);
        });
        item.isShow = isShow;
      }
      obj.checkboxChange = function(e) {
        let checkParent = {};
        var FLAG = true;
        var dataset = e.currentTarget.dataset;
        obj.setData({
          checked: !obj.data.checkedItem[dataset.checked] ? true : false
        });
        checkParent.checked = !obj.data.checkedItem[dataset.checked] ? true : false;
        checkParent.parentid = dataset.parentid;
        checkParent.parentids = dataset.parentids.split(',');
        checkParent.data = dataset.data;
        checkParent.items = dataset.data.items[dataset.index];
        isChecked(checkParent);
        for (var i in checkParent.parentids) {
          isCheckedParent(obj.data.dataOne, checkParent.parentids[i])
        }
        obj.setData({
          checkedItem: obj.data.checkedItem
        });
        clearCss(obj.data.checkedItem);
      };

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
        obj.data.checkedItem[items.id] = obj.data.checked;
        if (items.items.length > 0) {
          for (var i = 0; i < items.items.length; i++) {
            obj.data.checkedItem[items.items[i].id] = obj.data.checked;
            checkParent.items = items.items[i];
            if (items.items[i]) isChecked(checkParent);
          }
        }
      };

      function preSearch(node, nodefather) {
        for (var i = 0; i < node.length; i++) {
          var childs = node[i].items,
            item;
        }
        if (node) {
          nodefather.push(node);
        }
        for (var j = 0; j < childs.length; j++) {
          item = childs[j];
          preSearch(item);
        }

      };
<<<<<<< HEAD
      obj.search = function(event) {
=======
      obj.search = function() {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
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
<<<<<<< HEAD
         obj.keywordSearch(event);
      };
      obj.clear = function() {
        //if (obj.data.ocs_clear != "") return;
=======
        obj.keywordSearch();
      };
      obj.clear = function() {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
        var imodel = obj.data.inputModel;
        for (var key in imodel) {
          imodel[key] = "";
        };
<<<<<<< HEAD
        var allMenuarry = allMenu.getAllMenu();
        var ndataOne = allMenu.generateMenuData(allMenuarry, obj.data.moduleCode||"ALL");
=======
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
        obj.setData({
          checkedItem: {},
          parameter: {},
          expectedTimeOne: '',
          expectedTimeOneTwo: '',
          inputModel: imodel,
<<<<<<< HEAD
          dataOne: ndataOne
        });

=======
          menuOpen: {},
          dataOne: allMenu.getMenu()
        });
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
        clearCss(obj.data.checkedItem);
      };

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
<<<<<<< HEAD
      if (!obj.data.setting) {
        obj.search();
      }
=======
       if (!obj.data.setting){
         obj.search();
       }
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    });
  },
  show: function(obj, screeningHidden) {
    obj.setData({
      screeningHidden: screeningHidden
    });
  },
  getAllMenu: function() {
    return allMenu;
<<<<<<< HEAD
  },

=======
  }
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
}