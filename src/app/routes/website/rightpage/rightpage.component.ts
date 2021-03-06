import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {AjaxService} from "../../../core/services/ajax.service";
import {ActivatedRoute,Router} from '@angular/router';
import {AreasComponent} from "../areas/areas.component";
const swal = require('sweetalert');

@Component({
  selector: 'app-rightpage',
  templateUrl: './rightpage.component.html',
  styleUrls: ['./rightpage.component.scss']
})
export class RightpageComponent implements OnInit {
  public queryId:number;//获取添加，修改的ID
  public areaCode:string;//获取区域编码
  public  staff= {}
  public limitForm = {
    areaCode: '',
    level:'',
    areaName:''
  }

  // 构造 初始化
  constructor(public settings: SettingsService,public router:Router,public ajax:AjaxService,public routeInfo:ActivatedRoute,public AreasComponent:AreasComponent) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }
  ngOnInit() {
    this.queryId = this.routeInfo.snapshot.queryParams['id'];
    this.areaCode = this.routeInfo.snapshot.queryParams['areaCode'];


    /**
     * 请求详细数据，并显示()
     */
    if(typeof(this.areaCode)) {
      this.ajax.get({
        url: '/res/area/getAreaByAreaCode',
        async: false, //同步请求
        data: {area_code: this.areaCode},
        success: (res) => {
          this.staff = res.data[0];
        },
        error: (res) => {
          console.log("post limit error");
        }
      });
    }
  }

  /**
   * 关闭右侧滑动页面
   */
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  /**
   * 添加/修改
   * @param value 必填信息
   */
  addLimitList(value){
    let _this = this;
    //添加区域信息
    if(_this.queryId == 1){
      _this.ajax.post({
        url: '/res/area/addArea',
        data: {
          'areaCode': value.areaCode,
          'level': value.level,
          'areaName': value.areaName
        },
        success: (res) => {
          if (res.success) {
            _this.router.navigate(['/main/website/areas'], {replaceUrl: true}); //路由跳转
            swal('添加区域提交成功！', '','success');
            _this.AreasComponent.queryList()//实现刷新
          } else {
            swal('添加区域提交失败====！', 'error');
          }
        },
        error: (data) => {
          swal('添加区域提交失败！', '','error');
        }
      })
    }
    //修改区域信息
    else if(_this.queryId == 2) {
      _this.ajax.put({
        url: '/res/area/updateNameByCode',
        data: {
          'areaCode': value.areaCode,
          'areaName': value.areaName
        },
        success: (res) => {
         // console.log(res)
          if (res.success) {
            _this.router.navigate(['/main/website/areas'], {replaceUrl: true});   //路由跳转
            swal('修改区域信息成功！', '','success');
            _this.AreasComponent.queryList()//实现刷新
          } else {
            swal(res.info, '', 'error');
          }
        },
        error: (data) => {
          swal('修改区域信息失败！', '','error');
        }
      });
    }
  }
}
