import { Component, OnInit } from '@angular/core';
import {Page} from '../../../core/page/page';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {StoreOrderService} from '../store-order.service';
import {SubmitService} from '../../../core/forms/submit.service';
import {isUndefined} from 'ngx-bootstrap/bs-moment/utils/type-checks';
import {PageEvent} from '../../../shared/directives/ng2-datatable/DataTable';
import {GoodsService} from '../../goods/goods.service';

@Component({
  selector: 'app-store-all',
  templateUrl: './store-all.component.html',
  styleUrls: ['./store-all.component.scss']
})
export class StoreAllComponent implements OnInit {
  public path: string;       //路由
  public ordState: string;    //订单类型
  public curCancelOrderId: string;
  public curDeliverOrderId: string;
  public lookLogisticsOrderId: string;
  public goodsList: Page = new Page();
  public phone: string;//查询条件手机号
  public ordno: string;//查询条件订单号
  public storeCode: string='';//查询店铺编码
  public LogisticsData: any;//物流信息
  public voList: any;   //店铺列表列表
  public showList: boolean = true;     //是否显示列表页
  public bsConfig: Partial<BsDatepickerConfig>;
  public stores: Array<any> = new Array();//店铺列表

  constructor(public storeOrderService: StoreOrderService, public submit: SubmitService,public goods:GoodsService) {
    this.stores = this.goods.getAllStores();
  }

  ngOnInit() {
    let me = this;
    me.queryDatas(1);
  }

  /**
   * 子组件加载时
   * @param event
   */
  activate(event) {
    this.showList = false;
    event.single = true;
  }

  /**
   * 子组件注销时
   * @param event
   */
  onDeactivate(event) {
    this.showList = true;
    if (event.refresh) this.queryDatas(1);//在详情页面发货返回需要刷新页面数据
  }

  /**
   *显示物流信息
   * @param orderId
   */
  showLogistics(Logistics, ordno) {
    Logistics.style.display = 'block';
    if (isUndefined(ordno)) ordno = ordno;
    this.LogisticsData = this.storeOrderService.getOrderLogisticsData(ordno);
  }

  /**
   *隐藏物流信息
   * @param orderId
   */
  hideLogistics(Logistics) {
    Logistics.style.display = 'none';
  }


  /**
   * 选择店铺
   * @param value
   */
  selectedStore(value: any): void {
    this.storeCode = value.id;
  }

  /**
   * 删除信息
   * @param value
   */
  public removed(value:any):void {
    this.storeCode='';
  }

  /**
   * 查询列表
   * @param event
   * @param curPage
   */
  public queryDatas(curPage, event?: PageEvent) {
    let _this = this, activePage = 1;
    if (typeof event !== 'undefined') {
      activePage = event.activePage;
    } else if (!isUndefined(curPage)) {
      activePage = curPage;
    }
    let requestData = {
      curPage: activePage,
      pageSize: 10,
      sortColumns: '',
      phone: _this.phone,
      ordno: _this.ordno,
      storeCode: _this.storeCode
    };
    let requestUrl = '/ord/queryStoreOrd';
    _this.goodsList = new Page(_this.submit.getData(requestUrl, requestData));
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

  deliverOrder(orderId) {
    this.curDeliverOrderId = orderId;
  }

  /**
   * 发货回调函数
   * @param data
   */
  getDeliverOrderData(data) {
    this.curDeliverOrderId = null;
    if (data.type) this.queryDatas(1)//在当前页面发货之后需要刷新页面数据
  }

}
