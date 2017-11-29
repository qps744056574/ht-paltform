  import { Component, OnInit } from '@angular/core';
import {AjaxService} from "../../../../core/services/ajax.service";
import {SubmitService} from "../../../../core/forms/submit.service";
import {Page} from "../../../../core/page/page";
import {PageEvent} from "../../../../shared/directives/ng2-datatable/DataTable";
  import {PatternService} from "../../../../core/forms/pattern.service";
  import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
  import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
  import {listLocales} from "ngx-bootstrap/bs-moment";

@Component({
  selector: 'app-integration-details',
  templateUrl: './integration-details.component.html',
  styleUrls: ['./integration-details.component.scss']
})
export class IntegrationDetailsComponent implements OnInit {
  public data: Page = new Page();
  public phone:string='';//查询的会员手机
  public authStates:any;    //操作类型枚举
  public authState:string='';//操作类型
  locale = 'en';
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;
  applyLocale(pop: any) {
    this.bsConfig = Object.assign({}, { locale: 'cn' });
    setTimeout(() => {
      pop.hide();
      pop.show();
    });
  }
  constructor(public ajax: AjaxService, public submit: SubmitService,public tools: RzhtoolsService) {
    // this.bsConfig = Object.assign({}, {
    //   locale: 'cn',
    //   dateInputFormat: 'YYYY-MM-DD',//将时间格式转化成年月日的格式
    //   containerClass: 'theme-blue',
    //   rangeInputFormat: 'YYYY-MM-DD'
    // });
  }

  ngOnInit() {
    let _this=this;
    _this.qeuryAllService();
    _this.authStates = this.tools.getEnumDataList('1027');   //操作类型枚举列表

  }

  //重消币明细--查询分页
  qeuryAllService(event?: PageEvent){
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    let url = "/custCoin/query";
    let data={
      curPage: activePage,
      pageSize:20,
      phone:me.phone,
      logType:me.authState
    }
    let result = this.submit.getData(url,data);
    me.data = new Page(result);
  }
}
