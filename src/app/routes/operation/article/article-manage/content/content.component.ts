import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {ContentService} from "./content.service";
import {PageEvent} from "../../../../../shared/directives/ng2-datatable/DataTable";
const swal = require('sweetalert');

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit  {

  public articleManListdata;//存储文章列表的数据

  public flag:boolean=true;//定义boolean值用来控制内容组件是否显示

  private updatebutton:Object;//更新文章按钮
  private deletebutton:Object;//删除文章按钮
  private detailsbutton:Object;//查看详情按钮

  constructor(private router:Router,public ContentService:ContentService) {
  }

  ngOnInit() {
    /**
     * 路由事件用来监听地址栏的变化，当新增文章出现的时候吗，内容组件隐藏
     */

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          console.log(event.url)
          if(event.url=='/main/operation/article/manage/addArticle?linkType=addArticle'){
            console.log(event.url)
            this.flag=false;
            console.log(this.flag)
          }else if(event.url=='/main/operation/article/manage'){
            this.flag=true;
          }
        }
      });
    this.updatebutton={
      title:"编辑",
      type: "update"
    };
    this.deletebutton={
      title:"删除",
      type: "delete"
    };
    this.detailsbutton={
      title:"详情",
      type: "details"
    };

    this.queryArticManleList()//调用文章的列表
  }

  /**
   * 获取文章管理的列表数据(初始化的时候和点击页码的时候都会调用)
   * @param event 点击页码时候的事件对象
   */
  public queryArticManleList(event?:PageEvent) {
    let activePage = 1;
    if(typeof event !== "undefined") activePage =event.activePage;
    let data={
      curPage:activePage,
      pageSize:6,
      articleState:'DRAFT'
    }
    let url= "/article/queryAllArticle";
    let result=this.ContentService.queryData(data,url);
    this.articleManListdata= result;
  }

  /**
   * 删除文章 首先进行确认是否删除
   */
  delArticle(delId){
    let that=this;
    swal({
      title: "您确定要删除吗？",
      text: "您确定要删除这条数据？",
      type: "warning",
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonText: "是的，我要删除",
      confirmButtonColor: "#ec6c62"
    },function(isConfirm){
      if (isConfirm) {
        let url='/article/deleteArticleByState';
        let data={
          id:delId
        }
        let  flag = that.ContentService.confirmDel(url,data)
        if(flag){
          that.queryArticManleList()
        }
      } else {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
  }


}