import { Component, OnInit } from '@angular/core';
import {WoManageComponent} from "../wo-manage/wo-manage.component";
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {defineLocale} from "ngx-bootstrap/bs-moment";
import {zhCn} from "ngx-bootstrap/locale";
import {PageEvent} from "angular2-datatable";
import {isUndefined} from "util";
import {Page} from "../../../core/page/page";
import {SubmitService} from "../../../core/forms/submit.service";
import {ActivatedRoute} from "@angular/router";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
defineLocale('cn', zhCn);

@Component({
  selector: 'app-wo-assign',
  templateUrl: './wo-assign.component.html',
  styleUrls: ['./wo-assign.component.scss']
})
export class WoAssignComponent implements OnInit {
  private path: string;
  private assign: boolean = false;
  private woList: Page = new Page();
  private woTypeList:any;     //工单类型列表
  private detail = [];
  private search = {
    wono: null,
    ordno: null,
    ordType: '',
    stateEnum: 'NO',
    pageSize: 3,
    sortColumns: null
  } //搜索条件
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private parentComp: WoManageComponent,
              private route: ActivatedRoute,
              private tools: RzhtoolsService,
              private submit: SubmitService,) {
    this.bsConfig = Object.assign({}, {
      locale: 'cn',
      containerClass: 'theme-blue',
      rangeInputFormat: 'YYYY/MM/DD'
    });
    this.parentComp.woType = 2;
  }

  ngOnInit() {
    let me = this;
    me.woTypeList = me.tools.getEnumDataList(1301);//工单类型列表
    me.queryDatas(1);
    //获取当前路由
    me.route.url.subscribe(urls => {
      me.path = urls[0].path;
      switch (me.path) {
        case "assign":
          me.assign = true;
          break;
      }
    });
  }

  /**
   * 修改查询条件时，将另外一个条件置为空
   * @param condition
   */
  changeCondition(condition){
    if(condition == 'wono') this.search.ordno = null;
    else this.search.wono = null;
  }

  /**
   * 查询列表
   * @param event
   * @param curPage
   */
  public queryDatas(curPage, event?: PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== 'undefined') {
      activePage = event.activePage;
    } else if (!isUndefined(curPage)) {
      activePage = curPage;
    }
    let requestUrl = '/wo/query';
    me.search['curPage'] = activePage;
    me.woList = new Page(me.submit.getData(requestUrl, me.search));
    me.detail = [];//每次切换新页面，详情都关闭
  }

  /**
   * 展示详情
   * @param index
   */
  showDetail(index) {
    this.detail[index] = !this.detail[index];
  }

}
