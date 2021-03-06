import { Component, OnInit } from '@angular/core';
import {OperationService} from "../../operation.service";
import {Page} from "../../../../core/page/page";
import {PageEvent} from "../../../../shared/directives/ng2-datatable/DataTable";
import {HeaderComponent} from "../../../../layout/header/header.component";
import {SubmitService} from "../../../../core/forms/submit.service";
import {Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {AppComponent} from "../../../../app.component";
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  public orderType: string = '';
  public platformInfoData:any;                           //平台消息的数据
  public deletebutton:Object;                            //删除按钮
  public idArr=[]                                        //存放id的数组
  constructor(public operationService:OperationService,public headerComponent:HeaderComponent,public submitService: SubmitService,public router:Router) { }

  /**
   * 1.对按钮进行赋值
   * 2.调用消息的列表
   */
  ngOnInit() {
    this.deletebutton={
      title:"删除",
      type: "delete"
    };
    this.queryAdminNotify(1)
  }

  /**
   * 获取通知的消息列表
   */
  queryAdminNotify(curPage,event?:PageEvent){
    let activePage = 1;
    if(typeof event !== "undefined") {
      activePage =event.activePage
    }else if(!isNullOrUndefined(curPage)){
      activePage =curPage
    };
    let url='/notifyAdmin/pageQuery';
    let data={
      curPage:activePage,
      pageSize:10,
      sortColumns:''
    };
    this.platformInfoData=new Page(this.operationService.linkGoods(url,data));
  }

  /**
   * 单个的修改消息是否已读
   *bol 是否 跳转页面
   */
  updateIsRead(id,bol?,detailUrl?,curPage?){
    let url='/notifyAdmin/updateIsRead';
    let data={
      ids:id
    };
    this.platformInfoData=this.operationService.updateproblem(url,data);
    this.queryAdminNotify(curPage);
    if(bol){
      let url=$.trim(detailUrl);
      this.router.navigateByUrl(url);
    }
  }

  /**
   * 批量的修改消息是否已读,如果需要刷新页面把注释打开仿照的没有刷新
   *1.首先获取到当前选择的id
   */
  updateMoreIsRead(curPage){
    let obj = $("._every[checked='checked']");
    if(obj.length==0) {
      AppComponent.rzhAlt("info", '请先进行选择');
    }else{
      let url = '/notifyAdmin/updateIsRead';
      for(let i=0;i<obj.length;i++){
        this.idArr.push($(obj[i]).val())
      }
      let idStr= this.idArr.join(',');
      let data={
        ids	:idStr
      };
      this.platformInfoData=this.operationService.updateproblem(url,data);
      this.queryAdminNotify(curPage);
      if($('._all').prop("checked")){//如果全选按钮被勾选了，让它没有勾选
        $('._all').prop("checked",false);
        $('._all').attr("checked",false);
      }
    }
  }

  /**
   * 单选框勾选时执行的方法
   */
  getId(obj){
    if ($(obj).prop("checked")) {
      $(obj).attr("checked", true)
      $(obj).prop("checked", true) //单选框被选中
    } else {
      $(obj).attr("checked", false)
      $(obj).prop("checked", false);
    }
    this.inputSelect();
  }

  /**
   * 点击单个input的时候，总的input的变化
   *@param boolean
   *
   */
  inputSelect() {
    let goodLength = $("._every").length //消息的总长度
    let checkGoodLength = $("._every[checked='checked']").length//被选择的消息的长度
    if (goodLength == checkGoodLength) {
      $("._all").prop("checked", true)
      $("._all").attr("checked", true)
    } else {
      $("._all").prop("checked", false)
      $("._all").attr("checked", false)
    };

  }

  /**
   * 点击全选按钮获取所有的id
   */
  getAllId(){
    if ($('._all').prop('checked')) {
      $('._all').attr('checked', true)
      $("._every").prop("checked", true);
      $("._every").attr("checked", true);
    } else {
      $('._all').attr('checked', false)
      $('._all').removeAttr('checked')
      $("._every").prop("checked", false);
      $("._every").attr("checked", false);
    }
  }

  /**
   * 删除单个消息 首先进行确认是否删除，删除后刷新页面
   */
  deleteTpl(delSortId,curPage){
    let that=this;
    swal({
      title: "您确定要删除吗？",
      text: "您确定要删除这条消息？",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: '取消',
      closeOnConfirm: false,
      confirmButtonText: "确认",
      confirmButtonColor: "#ec6c62"
    },function(isConfirm){
      if (isConfirm) {
        swal.close(); //关闭弹框
        let url='/notifyAdmin/deleteByIdStr';
        let data={
          idStr:delSortId
        }
        that.operationService.delRequest(url,data);
        that.queryAdminNotify(curPage);
        that.headerComponent.queryAdminNotify();
      }
    });
  }

  /**
   * 批量的删除信息
   */
  delMoreInfo(curPage){
    let that=this;
    if($("._every[checked='checked']").length==0){
      AppComponent.rzhAlt("info", '请先进行选择');
    }else{
      swal({
        title: "您确定要删除吗？",
        text: "您确定要删除这条消息？",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: '取消',
        closeOnConfirm: false,
        confirmButtonText: "确认",
        confirmButtonColor: "#ec6c62"
      },function(isConfirm){
        if (isConfirm) {
          swal.close(); //关闭弹框
          let url='/notifyAdmin/deleteByIdStr';
          let obj=$("._every[checked='checked']");
          for(let i=0;i<obj.length;i++){
            that.idArr.push($(obj[i]).val())
          }
          let idStr= that.idArr.join(',');
          let data={
            idStr:idStr
          }
          that.operationService.delRequest(url,data)
          that.queryAdminNotify(curPage);
          that.headerComponent.queryAdminNotify();
          $("._all").prop('checked',false);
          $("._all").attr('checked',false);
        }
      });
    }
  }
}
