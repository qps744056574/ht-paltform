import { Injectable } from '@angular/core';
import {isNull} from "util";
import {AjaxService} from "../../../core/services/ajax.service";
import {AppComponent} from "../../../app.component";
@Injectable()
export class AdddataService {

  constructor(public ajax: AjaxService) { }

  /**
   *  添加key
   */
  getaddData(requestData) {
    let result;
    this.ajax.post({
      url: "/datadict/addDatadictType",
      data: requestData,
      async: false,
      success: (res) => {
        result=res.success;
        if (res.success) {
          AppComponent.rzhAlt("success",res.info);
        }else{
          AppComponent.rzhAlt("error",res.info);
        }
      },
      error: (res) => {
        result='';
        AppComponent.rzhAlt("error",res.info);
      }
    });
    return result;
  }

  /**
   * t通过id查询分类
   * @param url
   * @param data
   * @returns {any}
   */
  public queryClassById(url,data) {
    var result;
    this.ajax.get({
      url: url,
      data: data,
      async:false,
      success: (data) => {
        if (!isNull(data)) {
          if(data.success==true){
            result=data.data;
            let info=data.info;
          }else{
            console.log('aa 返回的success为假');
          }
        }else{
          console.log('aa 返回的数据为空');
        }
      },
      error: () => {
        AppComponent.rzhAlt("error","操作失败");
      }
    });
    return result
  }


  /**
   * val添加服务
   */
  public addClass(url,data) {
    let result;
    this.ajax.post({
      url: url,
      data: data,
      async:false,
      success: (res) => {
        result=res.success;
        if(res.success){
          AppComponent.rzhAlt("success", res.info);
        }else{
          AppComponent.rzhAlt("error", res.info);
        }
      },
      error: (res) => {
        result='';
        AppComponent.rzhAlt("error", res.info);
      }
    });
    return result;
  }

  /**
   * val修改服务
   */
  public updateClass(url,data) {
    var result;
    this.ajax.put({
      url: url,
      data: data,
      async:false,
      success: (res) => {
        result=res.success;
        if(res.success){
          AppComponent.rzhAlt("success", res.info);
        }else{
          AppComponent.rzhAlt("error", res.info);
        }
      },
      error: (res) => {
        result='';
        AppComponent.rzhAlt("error", res.info);
      }
    });
    return result
  }

}
