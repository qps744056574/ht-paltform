import {Component, OnInit} from "@angular/core";
import {StockComponent} from "../stock.component";
import {Page} from "../../../../core/page/page";
import {PageEvent} from "../../../../shared/directives/ng2-datatable/DataTable";
import {SubmitService} from "../../../../core/forms/submit.service";
import {isUndefined} from "ngx-bootstrap/bs-moment/utils/type-checks";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {defineLocale} from "ngx-bootstrap/bs-moment";
import {zhCn} from "ngx-bootstrap/locale";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
import {AllStockService} from "./all-stock.service";
import {StockService} from "../stock.service";
defineLocale('cn', zhCn);
const swal = require('sweetalert');


@Component({
  selector: 'app-all-stock',
  templateUrl: './all-stock.component.html',
  styleUrls: ['./all-stock.component.scss']
})
export class AllStockComponent implements OnInit {
  public orderType: number = 1;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  public agentAcct;
  public agentOrdno;
  public agentTime;
  public curCancelOrderId: string;
  public curDeliverOrderId: string;
  public lookLogisticsOrderId: string;
  public showList: boolean = true;
  public orderId1:any;
  public goodspay1:any;
  public curPage1:any;
  public showBankWindow:boolean = false;
  public goodsList: Page = new Page();
  public LogisticsData: any;//物流信息


  constructor(public StockComponent: StockComponent, public submit: SubmitService,public AllStockService:AllStockService,public StockService:StockService) {
    this.bsConfig = Object.assign({}, {
      locale: 'cn',
      rangeInputFormat: 'YYYY/MM/DD',//将时间格式转化成年月日的格式
      containerClass: 'theme-blue'
    });
  }

  ngOnInit() {
    let _this = this;
    _this.StockComponent.orderType = 1;
    _this.queryDatas(1)
  }

  /**
   * 子组件加载时
   * @param event
   */
  activate(event) {
    this.showList = false;
  }

  /**
   * 子组件注销时
   * @param event
   */
  onDeactivate(event) {
    this.showList = true;
    this.StockComponent.orderType = 1;

  }

  /**
   * 查询列表
   * @param event
   * @param curPage
   */
  public queryDatas(curPage, event?: PageEvent) {
    console.log('█ this.agentTime ►►►', this.agentTime);

    let _this = this, activePage = 1;
    if (typeof event !== 'undefined') {
      activePage = event.activePage;
    } else if (!isUndefined(curPage)) {
      activePage = curPage;
    }
    let requestUrl = '/agentOrd/queryAgentOrdAdmin';
    //格式化时间格式
    let dateStr = '';
    if (this.agentTime) {
      dateStr = RzhtoolsService.dataFormat(this.agentTime[0], 'yyyy/MM/dd') + '-' + RzhtoolsService.dataFormat(this.agentTime[1], 'yyyy/MM/dd');
    }

    let requestData = {
      curPage: activePage,
      pageSize: 10,
      sortColumns: '',
      agentAcct: _this.agentAcct,
      ordno: _this.agentOrdno,
      dateStr: dateStr,
    };
    _this.goodsList = new Page(_this.submit.getData(requestUrl, requestData));
  }

  /**
   * 改变订单状态（设置配货）
   */
  distribution(getOrdno){
    let _this = this, url: string = "/agentOrd/updateStateToPrepare", data: any;
    swal({
        title: '确定该商品已配货？',
        type: 'info',
        confirmButtonText: '确认', //‘确认’按钮命名
        showCancelButton: true, //显示‘取消’按钮
        cancelButtonText: '取消', //‘取消’按钮命名
        closeOnConfirm: false  //点击‘确认’后，执行另外一个提示框
      },
      function () {  //点击‘确认’时执行
        swal.close(); //关闭弹框
        data = {
          ordno:getOrdno
        }
        console.log(data)
        _this.AllStockService.ordno(url, data); //删除数据
        _this.queryDatas(1);
      }
    );
  }

  /**
   * 显示买家信息
   * @param event
   * @param i
   */
  showUserInfo(i) {
    i.style.display = 'block';
  }

  /**
   * 隐藏买家信息
   * @param i
   */
  hideBuyerInfo(i) {
    i.style.display = 'none';
  }

  cancelOrder(orderId) {
    this.curCancelOrderId = orderId;
  }

  /**
   * 取消订单回调函数
   * @param data
   */
  getCancelOrderData(data) {
    this.curCancelOrderId = null;
  }

  /*
   * 添加弹窗
   * */
  addBankData(orderId,goodspay,curPage) {
    this.orderId1=orderId;
    this.goodspay1=goodspay;
    this.curPage1=curPage;
    this.showBankWindow = true;

  }

  /**
   *显示物流信息
   * @param orderId
   */
  showLogistics(Logistics,ordno) {
    Logistics.style.display = 'block';
    if(isUndefined(ordno)) ordno = ordno;
    this.LogisticsData = this.StockService.getOrderLogisticsData(ordno);
  }
  /**
   *隐藏物流信息
   * @param orderId
   */
  hideLogistics(Logistics) {
    Logistics.style.display = 'none';
  }

  /**
   * 付款回调函数
   * @param data
   */
  getBankResult(data) {
    this.showBankWindow = false;
    if(data == 'success') this.queryDatas(1)
  }

}
