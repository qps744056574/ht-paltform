import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SubmitService} from "../../../../core/forms/submit.service";
import {Page} from "app/core/page/page";
import {isUndefined} from "util";
import {PageEvent} from "angular2-datatable";
import {GoodsService} from "../../goods.service";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
import {Setting} from "../../../../core/settings/setting";
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-stores-goods',
  templateUrl: './stores-goods.component.html',
  styleUrls: ['./stores-goods.component.scss']
})
export class StoresGoodsComponent implements OnInit {
  public showList: boolean = true;     //是否显示列表页
  public goodsList: Page = new Page();
  public goodsUrls: any = Setting.URLS.goods;
  public query: any = {
    kindId: '',
    goodsName: '',
    brandName: '',
    state: '',
    isOwnPlat: 'N',
    curPage: 1,
    pageSize: 10,
    sortColumns: 'create_time DESC',//倒序排列
    goodsAudit: '',
  }; // 查询条件
  public kindList;// 分类列表
  public goodsAudits: any;  // 商品审核状态列表
  public goodsState: any;  // 商品状态列表
  public curBaseCode: string;  // 当前商品基本编号
  public curName: string;    // 当前商品名称
  public stores: Array<any> = new Array();//店铺列表

  constructor(public router: Router,
              public tools: RzhtoolsService,
              public submit: SubmitService,
              public goodsService: GoodsService) {
  }

  ngOnInit() {
    let me = this;
    me.queryDatas(); //查询商品列表
    me.kindList = this.goodsService.getKindList(); //获取分类列表
    me.goodsAudits = this.tools.getEnumDataList('1014');  // 商品审核状态列表
    me.goodsState = this.tools.getEnumDataList('1006');  // 商品状态列表
    let stores = me.goodsService.getAllStores();
    stores.forEach((item, i) => {
      if (item.id == Setting.SELF_STORE) stores.splice(i, 1)
    })
    me.stores = stores;
  }

  /**
   * 选择店铺
   * @param value
   */
  selectedStore(value: any): void {
    this.query.storeCode = value.id;
    this.queryDatas(1);
  }

  unSelectStore(): void {
    this.query.storeCode = null;
    this.queryDatas(1);
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
    if (event.refresh) this.queryDatas(this.query.curPage)
  }

  /**
   * 选择分类
   * @param data  选择分类组件输出数据
   */
  getKind(data) {
    this.query.kindId = data.kindId;
    this.queryDatas()
  }

  /**
   * 修改商品状态
   * @param type  状态类型
   * @param baseCode   商品基本编码
   * @param pPage  当前页码
   */
  changeState(type, baseCode, pPage) {
    let me = this;
    if (isUndefined(pPage)) pPage = 1;
    switch (type) {
      case 'DOWN':    // 下架
        swal({
            title: "操作警示",
            text: "下架后，所有sku商品都将下架<br>代理商将不能批发该商品",
            type: "warning",
            html: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonText: "取消",
            confirmButtonText: "确认下架",
            closeOnConfirm: false
          },
          function () {
            swal.close();
            me.submit.putRequest('/goodsEdit/updateStateToDown', {goodsBaseCode: baseCode});
            me.queryDatas(pPage);// 刷新当前页
          });
        break;
      case 'STOP':    // 禁售
        swal({
            title: "操作警示",
            text: "禁售后，所有sku商品都将禁售<br>代理商将不能批发该商品",
            type: "warning",
            html: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonText: "取消",
            confirmButtonText: "确认禁售",
            closeOnConfirm: false
          },
          function () {
            swal.close();
            me.submit.putRequest('/goodsEdit/updateStateToStop', {goodsBaseCode: baseCode});
            me.queryDatas(pPage);// 刷新当前页
          });
        break;
      case 'NORMAL':  // 申请上架
        me.submit.putRequest('/goodsEdit/appleToNormal', {goodsBaseCode: baseCode});
        me.queryDatas(pPage);// 刷新当前页
        break;
      case 'BAN':     // 解除禁售
        me.submit.putRequest('/goodsEdit/updateStateToNomal', {goodsBaseCode: baseCode});
        me.queryDatas(pPage);// 刷新当前页
        break;
    }
  }

  /**
   *更改商品是否可用重消币
   * @param type
   * @param baseCode
   * @param curPage
   */
  changeIsUseCoin(type, baseCode, curPage) {
    let isUseCoin, requestData, requestUrl;
    isUseCoin = type ? 'N' : 'Y';
    requestUrl = '/goodsEdit/updateIsUseCoin';
    requestData = {
      goodsBaseCode: baseCode,
      isUseCoin: isUseCoin
    };
    this.submit.putRequest(requestUrl, requestData);
    this.queryDatas(curPage);
  }

  /**
   * 鼠标放在图片上时大图随之移动
   */
  showImg(event) {
    let target = event.target.nextElementSibling;
    target.style.display = 'block';
    target.style.top = (event.clientY + 20) + 'px';
    target.style.left = (event.clientX + 30) + 'px';
  }

  /**
   * 隐藏大图
   * @param event
   */
  hideImg(event) {
    let target = event.target.nextElementSibling;
    target.style.display = 'none';
  }

  /**
   * 查询列表
   * @param event
   * @param curPage
   */
  public queryDatas(curPage?, event?: PageEvent) {
    let _this = this, activePage = 1;
    if (typeof event !== 'undefined') {
      activePage = event.activePage;
    } else if (!isUndefined(curPage)) {
      activePage = curPage;
    }
    let requestUrl = '/goodsQuery/query';
    _this.query.curPage = activePage;
    _this.goodsList = new Page(_this.submit.getData(requestUrl, _this.query));
  }

  /**
   * 显示窗口组件，加载sku列表
   */
  showSkuList(baseCode, name) {
    this.curBaseCode = baseCode;
    this.curName = name;
  }

  /**
   * 查看sku商品的回调函数
   * @param data
   */
  getSkuData(data) {
    this.curBaseCode = null;
    if (data.type) this.queryDatas(data.page)
  }
}
