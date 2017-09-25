import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {isNullOrUndefined} from "util";
import {ActivatedRoute} from '@angular/router';
import {SubmitService} from '../../../../core/forms/submit.service';
import {AjaxService} from '../../../../core/services/ajax.service';
import {Page} from '../../../../core/page/page';
declare var $: any;
const swal = require('sweetalert');

@Component({
  selector: 'app-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.scss']
})
export class LogisticsComponent implements OnInit {
  public showCancelWindow:boolean = false;
  private ordnoA;
  public goodsList: Page = new Page();
  private goodsAudits: any;  // 商品审核状态列表
  private query;  // 商品审核状态列表
  public staff={};
  public ordno:string;//获取区域编码
  private expressNos;
  private expressCode;

  @Input('orderId') orderId: string;
  @Output() cancelOrder = new EventEmitter();
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['orderId'] && !isNullOrUndefined(this.orderId)){
      console.log("█ orderId ►►►",  this.orderId);
      $('.wrapper > section').css('z-index', 200);
      this.showCancelWindow = true;
      this.queryDatas();
    }
  }


  constructor(private ajax:AjaxService, private submit: SubmitService,private routeInfo:ActivatedRoute) { }

  ngOnInit() {
    let _this = this;
    _this.ordno = this.routeInfo.snapshot.queryParams['ordno'];
  }



  hideWindow(){
    $('.wrapper > section').css('z-index', 114);
    this.showCancelWindow = false;
    this.cancelOrder.emit('hide')// 向外传值
  }

  /**
   * 查询所有物流公司
   */
  queryDatas(){
    let _this = this, activePage = 1;
    let requestUrl = '/basicExpress/queryAllBasicExpress';
    let requestData = {
      queryKeywords:''
    };
    _this.goodsAudits = _this.submit.getData(requestUrl, requestData);
    console.log("█ _this.goodsAudits  ►►►",  _this.goodsAudits );
  }

  canceslOrder(){
    let _this = this;
    _this.ajax.put({
      url: '/agentOrd/updateStateToDelivery',
      data: {
        'ordno':_this.orderId,
        'expressNo':_this.expressNos,
        'expressCode':_this.expressCode
      },
      success: (res) => {
        if (res.success) {
          //_this.router.navigate(['/main/agent/agentperson'], {replaceUrl: true}); //路由跳转
          swal('已成功发货', '', 'success');
          // _this.AreasComponent.queryList()//实现刷新
        } else {
          swal(res.info);
        }
      },
      error: (data) => {
        swal('申请发货提交失败！', 'error');
      }
    })
  }
}