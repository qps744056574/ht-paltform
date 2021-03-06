import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {isNull, isNullOrUndefined} from "util";
import {Page} from "../../../core/page/page";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {zhCn} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap";
import {ActivitiesService} from "../activities.service";
import {PatternService} from "../../../core/forms/pattern.service";
import {AppComponent} from "../../../app.component";
import {Observable} from "rxjs/Observable";
defineLocale('cn', zhCn);
import 'rxjs/Rx';
declare var $: any;
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit,AfterViewInit,OnDestroy{

  public logType:any;                 //选择的红包流水类型
  public phone:string='';             //会员手机号
  public custName:string='';          //会员名称
  public dateStr;                      //传查询的时间范围
  public rpDeTailData:any;            //红包流水的数据
  public bsConfig: Partial<BsDatepickerConfig>;
  public minAmount:string='0';            //搜索区间默认的最小值
  public maxAmount:string='1000';           //搜索区间默认的最大值
  public minInputChange$:any;                 //面额input事件的变化
  public maxInputChange$:any;                 //面额input事件的变化
  @ViewChild('minValue') minValue:ElementRef;
  @ViewChild('maxValue') maxValue:ElementRef;

  constructor(private activitiesService: ActivitiesService,
              public patternService: PatternService) {
    this.bsConfig = Object.assign({}, {
      locale: 'cn',
      rangeInputFormat: 'YYYY/MM/DD',//将时间格式转化成年月日的格式
      containerClass: 'theme-blue'
    });
  }

  ngOnInit() {
    this.queryRpCustAcctRecAdmin(1);
  }

  ngAfterViewInit(){
    let that=this;
    this.minInputChange$=Observable.fromEvent(this.minValue.nativeElement,'keyup')
          .filter(e=>e['keyCode']=='13')
          .subscribe(()=>{that.queryRpCustAcctRecAdmin(1)})
    this.maxInputChange$=Observable.fromEvent(this.maxValue.nativeElement,'keyup')
      .filter(e=>e['keyCode']=='13')
      .subscribe(()=>{that.queryRpCustAcctRecAdmin(1)})
  }

  ngOnDestroy(){
    this.minInputChange$.unsubscribe();
    this.maxInputChange$.unsubscribe();
  }

  /**
   * 清空时间
   */
  clearTime(){
    this.dateStr = null;
    this.queryRpCustAcctRecAdmin(1);// 获取数据
  }

  /**
   * 查询红包明细（和后台一致）
   * @param curPage
   * @param event
   */
  queryRpCustAcctRecAdmin(curPage,event?:PageEvent){
    let activePage = 1;
    if(typeof event !== "undefined") {
      activePage =event.activePage
    }else if(!isNullOrUndefined(curPage)){
      activePage =curPage
    };
    let data={
      curPage:activePage,
      // pageSize:15,
      logType:'DRAW',//抽奖、中奖记录
      phone:this.phone,
      custName:this.custName,
      dateStr: this.dateStr?RzhtoolsService.dataFormat(this.dateStr[0], 'yyyy/MM/dd') + '-' + RzhtoolsService.dataFormat(this.dateStr[1], 'yyyy/MM/dd'):'',
      minAmount:this.minAmount,
      maxAmount:this.maxAmount,
    };
    let url='/rpCustAcctRec/queryRpCustAcctRecAdmin';
    this.rpDeTailData=new Page(this.activitiesService.queryRpCustAcctRecAdmin(url,data))
  }

  /**
   * 校验输入的最小面额值
   */
  getMinValue(value){
    if (String(value).indexOf('.') > -1) {
      let index = String(value).indexOf('.');
      let finalVal = String(value).slice(0, index + 3);
      setTimeout(() => {
        this.minAmount=finalVal;
      }, 0)
    }else if(!value){
      setTimeout(() => {
        this.minAmount='';
      }, 0)
    }
    if(value<0){
      setTimeout(()=>{
        this.minAmount='';
      },0);
      AppComponent.rzhAlt("info", '面额不能小于0');
    }
  }

  /**
   * 校验输入的最大面额值
   */
  getMaxValue(value){
    if (String(value).indexOf('.') > -1) {
      let index = String(value).indexOf('.');
      let finalVal = String(value).slice(0, index + 3);
      setTimeout(() => {
        this.maxAmount=finalVal;
      }, 0)
    }else if(!value){
      setTimeout(() => {
        this.maxAmount='';
      }, 0)
    }
    if(value<0){
      setTimeout(()=>{
        this.maxAmount='';
      },0);
      AppComponent.rzhAlt("info", '面额不能小于0');
    }
  }

}
