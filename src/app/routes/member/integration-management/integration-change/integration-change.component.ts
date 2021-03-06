import { Component, OnInit } from '@angular/core';
import {SubmitService} from "../../../../core/forms/submit.service";
import {PatternService} from "../../../../core/forms/pattern.service";
import {isNullOrUndefined} from "util";
import {ActivatedRoute} from "@angular/router";
import {IntegrationChangeService} from "./integration-change.service";


@Component({
  selector: 'app-integration-change',
  templateUrl: './integration-change.component.html',
  styleUrls: ['./integration-change.component.scss'],
  providers:[IntegrationChangeService]
})
export class IntegrationChangeComponent implements OnInit {
  public sum:any;//重消币
  public data: any = {
    phone: null,
    custCoin: null,
    logType: 'RECHARGE'
  };
  constructor(public submitt: SubmitService, public patterns: PatternService,public route: ActivatedRoute,
  public integrationChangeService:IntegrationChangeService) {
  }

  ngOnInit() {
  }

  /**
   * 手机号判断
   * @param phone
   * @returns {boolean}
   */
  testPhone(phone){
    if(/^1[0-9]{10}$/.test(phone)) return true;
  }

  /**
   * 查询重消币
   */
  queryCoin(){
    let _this=this;
    let url = '/custCoin/selectCoin';
    let data = {
      phone:_this.data.phone
    }
   _this.sum=_this.integrationChangeService.getData(url, data);
  }

  /**
   * 提交
   */
  submit() {
    let me=this;
    let url = '/custCoin/addCustCoin';
    let res = me.submitt.postRequest(url, this.data);
    if (isNullOrUndefined(res)) {
      me.data.phone = '';
      me.data.custCoin = '';
      me.sum.coin='';
      me.sum.recharge=''
    }
  }
}
