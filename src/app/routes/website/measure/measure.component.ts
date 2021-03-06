import { Component, OnInit } from '@angular/core';
import {MeasureService} from "./measure.service";
import {AjaxService} from "../../../core/services/ajax.service";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {SubmitService} from "../../../core/forms/submit.service";
import {isNullOrUndefined, isNumber, isString} from "util";
const swal = require('sweetalert');
@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss'],
  providers: [MeasureService]
})
export class MeasureComponent implements OnInit {

  public addbuttons;//添加按钮
  public updatebuttons: Object;//修改按钮
  public deletebuttons: Object;//删除按钮
  public data: Page = new Page();
  constructor(public ajax: AjaxService,public measureService: MeasureService,public submit: SubmitService) { }

  ngOnInit() {
    let me = this;
    //按钮配置
    me.addbuttons = {
      type: "add-thc",
      title: '添加',
      text:'添加计量单位'
    };
    me.updatebuttons = {
      title: "编辑",
      type: "update"
    };
    me.deletebuttons = {
      title: "删除",
      type: "delete"
    };
    me.qeuryAllService(1)
  }
  //计量单位--查询分页
  qeuryAllService(curPage,event?: PageEvent){
    let me = this, activePage = 1;
    if(typeof event !== "undefined") {
      activePage =event.activePage
    }else if(!isNullOrUndefined(curPage)){
      activePage =curPage
    };
    let url = "/goodsUnit/queryPage";
    let data={
      curPage: activePage,
      pageSize:10,
    }
    let result = me.submit.getData(url,data);
     me.data = new Page(result);
  }

 //计量单位--删除
  deleteCount(delid,curPage) {
    let me=this;
    let url = "/goodsUnit/deleteGoodsUnit";
    let data={
     id:delid
    }
    swal({
        title: '确认删除此信息？',
        type: 'info',
        confirmButtonText: '确认', //‘确认’按钮命名
        showCancelButton: true, //显示‘取消’按钮
        cancelButtonText: '取消', //‘取消’按钮命名
        closeOnConfirm: false  //点击‘确认’后，执行另外一个提示框
      },
      function () {  //点击‘确认’时执行
        swal.close(); //关闭弹框
        me.submit.delRequest(url, data); //删除数据
        me.qeuryAllService(curPage); //更新
      }
    );
  }
}
