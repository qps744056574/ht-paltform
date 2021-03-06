import { Injectable } from '@angular/core';
import {isNullOrUndefined} from 'util';
import {AppComponent} from '../../../app.component';
import {SubmitService} from '../../../core/forms/submit.service';
import {AjaxService} from '../../../core/services/ajax.service';

@Injectable()
export class OrderReviewService {
  static fincneUpload: string = "upload/basic/fincneUpload";//财务凭证上传，需要uuid, 返回URL，带HTTP
  constructor(public submit: SubmitService,public ajax: AjaxService) { }

  public getOrderLogisticsData(ordno) {
    let url = '/ord/tail/queryDeliveryList';
    let data = {ordno: ordno};
    return this.submit.getData(url, data);
  }

  /**
   * 查询物流公司列表
   */
  public getBasicExpressList() {
    let url = '/basicExpress/queryBasicExpressIsUseList';
    let list = this.submit.getData(url, '');
    if (!isNullOrUndefined(list))
      return list;
  }

  /**
   * 查询物流公司列表  get 成功不提示
   */  /**
 * 获取订单状态及物流信息
 * @param ordno
 * @returns {{orderStates: any, orderLogistics: any}}
 */
public getOrderState(ordno) {
  let orderStates;
  orderStates = this.submit.getData('/ord/tail/queryList', {ordno: ordno});
  return orderStates;
}

  /**
   * 根据订单编号查询物流信息
   * @param ordno
   */
  public basicExpressList(url,data){
    let result;
    this.ajax.get({
      url: url,
      data: data,
      async:false,
      success: (res) => {
        let info=res.info;
        if(res.success){
          result=res.data;
        }else{
          AppComponent.rzhAlt("error",info);
        }
      },
      error: (res) => {
        AppComponent.rzhAlt("error", res.status + '**' + res.statusText);
      }
    });
    return result;
  }


  /**
   * 根据订单编号获取订单详情
   * @param ordno
   * @returns {any}
   */
  public getOrderDetailByNO(ordno) {
    let url = '/ord/loadOrdByOrdno';
    let data = {
      ordno: ordno
    }
    let list = this.submit.getData(url, data);
    if (!isNullOrUndefined(list)) return list;
  }

  /**
   * 获取物流公司及运单号
   * @param ordno
   * @returns {any}
   */
  public getExpressInfo(ordno) {
    let url = '/ord/tail/loadByDelivery';
    let data = {
      ordno: ordno
    }
    let expressData = this.submit.getData(url, data);
    if (!isNullOrUndefined(expressData)) return expressData;
  }

}
