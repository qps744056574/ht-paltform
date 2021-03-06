import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {isNullOrUndefined} from "util";
import {AppComponent} from "../../../../app.component";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
import {SubmitService} from "../../../../core/forms/submit.service";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {SettingsService} from "../../../../core/settings/settings.service";
declare var $;
@Component({
  selector: 'app-analyze-users',
  templateUrl: './analyze-users.component.html',
  styleUrls: ['./analyze-users.component.scss']
})
export class AnalyzeUsersComponent implements OnInit {

  public flag: boolean = true;//定义boolean值用来控制内容组件是否显示
  datepickerModel: Date= new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  yearInfo: Array<string> = SettingsService.yearInfo; //获取年份信息
  month: Array<string> = SettingsService.month; //获取月份信息
  select: any = {}; //选择的年份和月份信息
  showType: any = {DAY: true, WEEK: false, MONTH: false}; //根据不同的状态显示
  weekForMonth: Array<string> = new Array(); //指定年月下的日期

  public queryType: any = 'DAY';//日期选择
  public queryTypes: any;//日期选择
  public queryContent: any="ORDSUM";//内容选择
  public queryContentText: any="下单金额(元)";//内容选择
  public queryContents;//内容选择

  queryTime: any = new Date();

  public data: any;
  now: string;
  nowData: any;

  /**
   * 图表1
   */
  public optionPrev = {};

  constructor(public router: Router, public tools: RzhtoolsService, public submit: SubmitService) {
    this.bsConfig = Object.assign({}, {
      locale: 'cn',
      dateInputFormat: 'YYYY-MM-DD',//将时间格式转化成年月日的格式
      containerClass: 'theme-blue'
   });
  }

  ngOnInit() {
    let _this = this;
    _this.queryTypes = this.tools.getEnumDataList('1401');   //时间状态枚举列表
    _this.queryContents = this.tools.getEnumDataList('1402');   //内容状态枚举列表
    _this.queryTime = RzhtoolsService.dataFormat(RzhtoolsService.getAroundDateByDate(new Date(this.queryTime), 0), 'yyyy-MM-dd');
    _this.qeuryAll();
  }

  /**
   * 获取年份和月份信息
   */
  getMonth() {
    let _this = this, ret: string = null;
    if (!_this.select || isNullOrUndefined(_this.select.year) || _this.select.year == "") AppComponent.rzhAlt("error", "年份必选");
    else if (isNullOrUndefined(_this.select.month) || _this.select.month == "") AppComponent.rzhAlt("error", "月份必选");
    else ret = _this.select.year + "-" + _this.select.month;
    return ret;
  }

  /**
   * 选择不同的显示条件
   */
  search() {
    let _this = this;
    _this.select.year = new Date().getFullYear();//获取默认年
    _this.select.month = '0'+(new Date().getMonth() + 1);//获取默认月
    _this.getWeekListByMonth();
    if (_this.queryType == "MONTH") _this.showType = {DAY: false, WEEK: false, MONTH: true};
    else if (_this.queryType == "WEEK") _this.showType = {DAY: false, WEEK: true, MONTH: false};
    else if (_this.queryType == "DAY") _this.showType = {DAY: true, WEEK: false, MONTH: false};
  }

  /**
   * 查询
   */
  qeuryAll(type?:string,obj?) {
    let me = this;
    if(!isNullOrUndefined(type)) me.queryContent = type;
    me.queryContentText = me.queryContent=='ORDSUM'?'下单金额(元)':'下单数量';
    let url = "/statistical/analyseCust";
    let data = {
      queryType: me.queryType,
      queryTime: me.queryTime,
      queryContent: me.queryContent
    }
    let result = this.submit.getData(url, data);
    me.data = result;
    me.nowData =me.data;
    me.optionPrevInfo();
  }

  /**
   * 绘制图表（私有）
   */
  public optionPrevInfo(){
    let _this = this;
    _this.optionPrev = {
      title: {
        left:"47%",
        text: '买家排行20名'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      toolbox: {
        show : true,
        right:"3%",
        feature : {
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: _this.nowData.keys,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name:_this.queryContentText ,
          type: 'bar',
          barWidth: '30%',
          data: _this.nowData.yaxis
        }
      ]
    };
  }

  /**
   * 根据指定年月获取周列表
   */
  getWeekListByMonth() {
    let _this = this, time = _this.getMonth();
    if (time != null) _this.weekForMonth = _this.tools.getWeekListByMonth(time.split("-")[0], time.split("-")[1]);
    //获取周列表
    _this.weekForMonth.forEach(ele => {//为了默认显示当前日期所在的周
      let start = new Date(ele.split('~')[0]).getDate();
      let end = new Date(ele.split('~')[1]).getDate();
      let now = new Date().getDate();
      if (now > start && now < end) {
        _this.select.week = ele;
      } else if (now == start || now == end) {
        _this.select.week = ele;//获取默认周
      } else if ((start<now&&now>end)&&(Math.abs(start-end)!=6)) {//两个月的交界处 28  29  3
        _this.select.week = ele;//获取默认周
      }else if(start>now&&now<end&&(Math.abs(start-end)!=6)){//两个月的交界处 28 3 2
        _this.select.week = ele;//获取默认周
      }
    });
  }

  /**
   * 查询对应的数据信息（新增会员数）
   * @param type 查询状态，如：日、周、月（DAY、WEEK、MONTH）
   */
  selectInfos() {
    let _this = this, type = _this.queryType;
    switch (type){
      case 'DAY':
        _this.queryTime = RzhtoolsService.dataFormat(new Date(this.datepickerModel), "yyyy-MM-dd");
        break;
      case 'MONTH':
        _this.queryTime = _this.getMonth();
        break;
      case 'WEEK':
        _this.queryTime = _this.select.week;
        break;
    };

    // if (type == "DAY") {
    //   if (!_this.datepickerModel || isNullOrUndefined(_this.datepickerModel)) {
    //     AppComponent.rzhAlt("error", "请选择日期");
    //   } else {
    //     // console.log("█ type  ►►►", type);
    //     // console.log("█ this.queryTime ►►►", this.queryTime);
    //     _this.qeuryAll(_this.queryType, _this.queryTime);
    //     //TODO 业务实现
    //   }
    // } else if (type == "WEEK") {
    //   if (isNullOrUndefined(_this.select.week) || _this.select.week == "") {
    //     AppComponent.rzhAlt("error", "请选择指定周");
    //   } else {
    //     _this.queryTime = _this.select.week;
    //     _this.qeuryAll(_this.queryType, _this.queryTime);
    //     //TODO 业务实现
    //   }
    // } else if (type == "MONTH") {
    //   let time = _this.getMonth();
    //   if (time != null) {
    //     _this.queryTime = _this.getMonth();
    //     _this.qeuryAll(_this.queryType, _this.queryTime);
    //     //TODO 业务实现
    //   }
    // } else {
    //   AppComponent.rzhAlt("error", "查询异常");
    // }
    if (!_this.queryTime || isNullOrUndefined(_this.queryTime)) {
      AppComponent.rzhAlt("error", "请选择日期");
    } else {
      _this.qeuryAll();
    }
  }

}
