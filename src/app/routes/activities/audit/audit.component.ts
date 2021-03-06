import {Component, OnInit} from '@angular/core';
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {isNullOrUndefined, isUndefined} from "util";
import {Page} from "../../../core/page/page";
import {ActivitiesService} from "../activities.service";
const swal = require('sweetalert');
@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  public auditListData: any;                           //审核列表的数据
  public curState: string = '';                           //当前的状态
  public dealButton: any;                               //处理申请的按钮
  public showStroeInvest: boolean = false;            //企业投资的弹窗
  public currentId: any;                               //当前的id
  public amountData: any;                              //获取提现总额和未提现总额
  public showList: boolean = true;                      //是否显示组件

  constructor(public activitiesService: ActivitiesService) {
  }

  ngOnInit() {
    this.qeuryAll('CR', 1);
    this.getWithDrawTotal();
    this.dealButton = {
      title: "处理",
      type: "update"
    };
  }


  /**
   * 获取提现总额和未提现总额
   */
  getWithDrawTotal() {
    let url = "/rpCustWithdraw/sumWithDraw";
    let data = {};
    let result = this.activitiesService.queryWithDrawAmount(url, data);
    if (result) {
      this.amountData = result;
    }
  }

  /**
   *展示红包企业的弹窗
   */
  showAlert(curId) {
    this.currentId = curId;
  }

  /**
   * 填写记录回调函数
   * @param data
   */
  getAddRecordData(data) {
    this.currentId = null;
    if (data.type) {
      this.qeuryAll(this.curState, data.page);
      this.getWithDrawTotal();
    }
  }

  /**
   * 审核默认通过
   */
  auditPass(id,payWay) {
    let that=this;
    swal({
      title: "您确定同意吗？",
      text: payWay=='REMIT'?'':'同意提现后，则直接打款\n打款成功，状态变为处理完成，否则，变为处理失败',
      type: "info",
      showCancelButton: true,
      cancelButtonText: '取消',
      closeOnConfirm: false,
      confirmButtonText: "同意",
      confirmButtonColor: "#ec6c62"
    },function(isConfirm){
      if (isConfirm) {
        swal.close(); //关闭弹框
        let url = "/rpCustWithdraw/updateStateTODeal";
        let data = {
          id: id
        };
        that.activitiesService.updateStateTODeal(url, data);
        that.qeuryAll(this.curState, 1);
        that.getWithDrawTotal();
      }
    });
  }

  /**
   * 提现申请的列表
   */
  qeuryAll(state, curPage, event?: PageEvent) {
    if (state) {
      this.curState = state;
    } else {
      if (!this.curState) {
        this.curState = 'CR';
      }
    }//解决分页切换标签后分页刷新的问题
    let me = this, activePage = 1;
    if (typeof event !== 'undefined') {
      activePage = event.activePage;
    } else if (!isUndefined(curPage)) {
      activePage = curPage;
    }
    ;
    let sortColumns;//定义排序规则
    if (this.curState == 'CR') {
      sortColumns='create_time DESC'
    }else if (this.curState == 'DEAL') {
      sortColumns='deal_time DESC'
    }else{
      sortColumns='done_time DESC'
    }
    let url = "/rpCustWithdraw/query";
    let data = {
      curPage: activePage,
      pageSize: 10,
      state: this.curState,
      sortColumns: sortColumns
    };
    let result = this.activitiesService.queryWithDrawData(url, data);
    me.auditListData = new Page(result);
  };

  /**
   * 子组件加载时
   * @param event
   */
  activate() {
    this.showList = false;
  }

  /**
   * 子组件注销时
   * @param event
   */
  onDeactivate() {
    this.showList = true;
  }
}
