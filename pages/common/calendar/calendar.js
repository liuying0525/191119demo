module.exports = {
  inintcalendar:function(obj){
    var currentObj = getCurrentDayString()
    var currentDay = obj.data.currentDay ? obj.data.currentDay : currentObj.getDate();
    obj.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentDay + '日',
      currentDay: currentDay,
      currentObj: currentObj
    })
    setSchedule(currentObj);
    obj.doDay = function (e) {
      var currentObj = obj.data.currentObj
      var Y = currentObj.getFullYear();
      var m = currentObj.getMonth() + 1;
      var d = currentObj.getDate();
      var str = ''
      if (e.currentTarget.dataset.key == 'left') {
        m -= 1
        if (m <= 0) {
          str = (Y - 1) + '/' + 12 + '/' + d
        } else {
          str = Y + '/' + m + '/' + d
        }
      } else {
        m += 1
        if (m <= 12) {
          str = Y + '/' + m + '/' + d
        } else {
          str = (Y + 1) + '/' + 1 + '/' + d
        }
      }
      currentObj = new Date(str)
      obj.setData({
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentObj.getDate() + '日',
        currentObj: currentObj
      })
      setSchedule(currentObj);
    }

     function getCurrentDayString() {
      var objDate = obj.data.currentObj
      if (objDate) {
        return objDate
      } else {
        var c_obj = new Date()
        var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
        return new Date(a)
      }
    }

     function setSchedule(currentObj) {
      var m = currentObj.getMonth() + 1
      var Y = currentObj.getFullYear()
      var d = currentObj.getDate();
      var dayString = Y + '/' + m + '/' + currentObj.getDate()
      var currentDayNum = new Date(Y, m, 0).getDate()
      var currentDayWeek = currentObj.getUTCDay() + 1
      var result = currentDayWeek - (d % 7 - 1);
      var firstKey = result <= 0 ? 7 + result : result;
      var currentDayList = []
      var f = 0
      for (var i = 0; i < 42; i++) {
        let data = []
        currentDayList[i]= {};
        if (i < firstKey - 1) {
          currentDayList[i].day = ''
        } else {
          if (f < currentDayNum) {
            currentDayList[i].day = f + 1
            f = currentDayList[i].day
            currentDayList[i].time = splicingDate(Y,m,f);
          } else if (f >= currentDayNum) {
            currentDayList[i].day = ''
          }
        }
      }
      obj.pitchOn = function(optins){
        var data = {};
        var key = obj.data.key;
        var thisdata = optins.currentTarget.dataset.thisdata;
        var types = key && key.length > 0 ? key.substring(key.length - 3, key.length) : key;
        if (!obj.data[key + 'Two']){
          var dateTwo = thisdata;
          var month = (currentObj.getMonth() + 1);
          if (thisdata < obj.data.num){
              dateTwo = dateTwo+1;
          }
          data[key + 'Two'] = currentObj.getFullYear() + '-' + month + '-' + dateTwo;
        }
        data[key] = currentObj.getFullYear() + '-' + (currentObj.getMonth() + 1) + '-' + thisdata
        data.currentDay = thisdata;
        data.currentDate = currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + thisdata + '日';
        data.calendarIsShow = true;
        obj.setData(data);
      }
      var currentTime = new Date();
      var time = splicingDate(currentTime.getFullYear(), (currentTime.getMonth() + 1), currentTime.getDate()-1);
      if (!obj.data.total) {
        verifyCurrentDate(currentDayList, time);
      }else{
        for (var i in currentDayList) {
          if (currentDayList[i].day) {
            currentDayList[i].pitchOn = 'pitchOn';
          }
        }
      }
      obj.setData({
        currentDayList: currentDayList,
        ocs_clear: ''
      })
    }
     function splicingDate(y,m,d){
       var month = '';
       if (m < 10) {
         month = '0' + m
       } else {
         month = m;
       }
       var date = '';
       if (d < 10) {
         date = '0' + d
       } else {
         date = d;
       }
       return y + '' + month + '' + date;
     } 
     function verifyCurrentDate(currentDayList, time) {
       var num = 0;
       for (var i in currentDayList) {
         if (currentDayList[i].day) {
           num++;
           if (parseInt(currentDayList[i].time) > parseInt(time)) {
             currentDayList[i].pitchOn = 'pitchOn';
           } else {
             currentDayList[i].beforeClass = 'color: #ccc;';
           }
         }
       }
       obj.setData({
         num: num
       })
     } 
  },
  inintPickerView: function (obj) {
    const date = new Date()
    const years = []
    const months = []
    const days = []
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }

    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    obj.setData({
      years: years,
      year: date.getFullYear(),
      months: months,
      month: 2,
      days: days,
      day: 2,
      year: date.getFullYear(),
      value: [9999, 1, 1],
    })
    obj.bindChange = function (e) {
      const val = e.detail.value
      this.setData({
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]]
      })
    }
  }
}
