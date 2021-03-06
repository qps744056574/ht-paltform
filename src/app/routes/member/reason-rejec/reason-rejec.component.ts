import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {SubmitService} from "../../../core/forms/submit.service";
import {isNullOrUndefined, isUndefined} from "util";
import {CertificationComponent} from "../certification/certification.component";
import {ReasonRejecService} from "./reason-rejec.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
declare var $: any;
const swal = require('sweetalert');
@Component({
  selector: 'app-reason-rejec',
  templateUrl: './reason-rejec.component.html',
  styleUrls: ['./reason-rejec.component.scss'],
  providers: [ReasonRejecService]
})
export class ReasonRejecComponent implements OnInit {
  public state: any;//审核状态
  public showRecord: boolean = true;         //默认是通过
  public isAgree: string = 'N';         //默认是通过
  public yesOrNo: any;         //商品审核是否通过枚举
  @Input('showReasonWindow') showReasonWindow: boolean;
  @Output() upDate = new EventEmitter();
  images: Array<string> = new Array();
  @Input('orderId') orderId: string;
  @Input('curPage') curPage: any;
  @Input('count') count: any = {};
  public reason: string = '';//驳回原因
  public reasonList: Array<string> = new Array();//选中的驳回原因编号
  public reasons: Array<string> = [
    '姓名必须与身份证姓名保持一致',
    '身份证号有误',
    '身份证有效期有误',
    '身份证正面照有误',
    '身份证正面照不清晰',
    '身份证反面照有误',
    '身份证反面照不清晰',
    '手持身份证照片有误',
    '手持身份证照片不清晰',
    '没有按顺序上传图片',
  ]

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showReasonWindow) {
      let me = this;
      $('.wrapper > section').css('z-index', 200);
      me.isAgree = 'N';
      me.images = new Array();
      me.reasonList = new Array();
      me.reason = '';
      me.images.push(me.count.idcardPic1, me.count.idcardPic2, me.count.idcardPic3);
    }else{
      $('.wrapper > section').css('z-index', 114);
    }
  }

  ngOnDestroy(): void {
    $('.wrapper > section').css('z-index', 114);
  }

  constructor(public reasonRejecService: ReasonRejecService,
              public submit: SubmitService,
              public tools: RzhtoolsService,
              public certificationComponent: CertificationComponent) {

  }

  ngOnInit() {
    this.yesOrNo = this.tools.getEnumDataList('1001');  // 商品审核是否通过
  }

  /**
   * 获取驳回原因
   * @param event
   * @param idx
   */
  getReasonId(event, idx) {
    let me=this;
    if (event.target.checked) {
      me.reasonList.push(me.reasons[idx]);
    } else {
      me.reasonList = me.reasonList.filter(item => {
        return item !== me.reasons[idx];
      })
    }
    if (me.reasonList.length > 0) me.reason = me.reasonList.join('，') + '，请重新提交';
    else me.reason = '';
  }

  /**
   * 关闭组件
   * @param type true:表示操作成功，false表示取消操作
   */
  hideWindow(type?: string) {
    let me = this;
    $('.wrapper > section').css('z-index', 114);
    me.showReasonWindow = false;
    if (isUndefined(type)) type = 'cancel';
    me.upDate.emit(type);
    me.reason = null;
  }

  /**
   * 认证通过
   */
  access(id) {
    let me = this;
    let url = '/custAuthInfo/updateState';
    let data = {
      id: id,
      state: 'PASS',
    }
    me.submit.putRequest(url, data);
    me.hideWindow("success");
    me.certificationComponent.aqeuryAll('AUDIT', me.curPage);
  }

  /*
   * 审核驳回原因
   * */
  delivery(obj) {
    let me = this;
    let url = '/custAuthInfo/updateState';
    let data = {
      id: this.orderId,
      state: 'UNPASS',
      verifyReason: obj.reason,
    }
    let a = this.reasonRejecService.reasonReject(url, data);
    me.hideWindow("success");
    me.certificationComponent.aqeuryAll('AUDIT', me.curPage);
  }

  /**
   * 改变是否成功
   */
  changeIsAgree(isAgree) {
    if (isAgree == 'Y') {
      this.isAgree = 'N';
      this.showRecord = false;
    } else {
      this.isAgree = 'Y';
      this.showRecord = true;
    }
  }


  imageViewerReady($event: any) {
    // console.log($event);
  }

}
