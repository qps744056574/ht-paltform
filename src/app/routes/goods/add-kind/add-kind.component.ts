import {Component, OnInit} from "@angular/core";
import {SettingsService} from "../../../core/settings/settings.service";
import {SubmitService} from "../../../core/forms/submit.service";
import {KindManageComponent} from "../kind-manage/kind-manage.component";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {AppComponent} from "../../../app.component";
import {FileUploader} from "ng2-file-upload";
import {GetUidService} from "../../../core/services/get-uid.service";
import {MaskService} from "../../../core/services/mask.service";
import {PatternService} from "../../../core/forms/pattern.service";
import {GoodsService} from "../goods.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
const swal = require('sweetalert');

@Component({
  selector: 'app-add-kind',
  templateUrl: './add-kind.component.html',
  styleUrls: ['./add-kind.component.scss']
})
export class AddKindComponent implements OnInit {
  public kindInfo:any= {};
  public path;// 当前路由
  public pageTitle;// 右弹窗页面标题
  public editKind: boolean = false;
  public tip = {
    commisRate: '请输入小数形式，0 <= 佣金比例 < 1',
    sort: '0-99，默认0',
    keywords: '多个关键词请用逗号隔开'
  }
  public upKindImg: boolean = false;
  public uuid: string;
  public fileName: string = '选择图片';// 文件名
  public myImg;// 我的图片，展示图片
  public uploader: FileUploader = new FileUploader({
    url: GoodsService.goodsUploader,
    itemAlias: "limitFile",
    allowedFileType: ["image"]
  }); //初始化上传方法

  constructor(public settings: SettingsService,
              public route: ActivatedRoute,
              public router: Router,
              public parentComp: KindManageComponent,
              public getUid: GetUidService,
              public patterns: PatternService,
              public tools: RzhtoolsService,
              public submit: SubmitService) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    let me = this;
    this.kindInfo['state'] = 'SHOW';
    this.kindInfo['level'] = '1';

    //获取当前路由
    me.route.url.subscribe(urls => {
      me.path = urls[0].path;
      //console.log("█ this.path ►►►", this.path);
      switch (me.path) {
        //新增分类
        case "addKind":
          //console.log("█ \"新增分类\" ►►►", "新增分类");
          me.pageTitle = "新增分类";
          me.editKind = true;
          this.uuid = this.getUid.getUid();
          let parmas = this.route.snapshot.queryParams;
          if(!isNullOrUndefined(parmas.pname)) this.kindInfo['parentKindName'] = parmas.pname;
          if(!isNullOrUndefined(parmas.pid)) this.kindInfo['kindParentId'] = parmas.pid;
          if(!isNullOrUndefined(parmas.level)) this.kindInfo['level'] = parmas.level;
          break;

        //修改分类
        case "upKind":
          //console.log("█ \"修改分类\" ►►►", "修改分类");
          me.pageTitle = "修改分类";
          me.editKind = true;
          me.kindInfo = this.getKindInfo();// 获取分类信息
          me.kindInfo.taxRate = me.kindInfo.taxRate?(me.kindInfo.taxRate*0.01).toFixed(2):0;
          break;
      }
    });
  }

  /**
   * 转到上传图片页面
   * @param id
   */
  toUpKindImg(id){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/goods/kind-manage/upKindImg'], { replaceUrl: true ,preserveQueryParams: true });
  }

  /**
   * 监听图片选择
   * @param $event
   */
  fileChangeListener() {
    // 当选择了新的图片的时候，把老图片从待上传列表中移除
    if(this.uploader.queue.length > 1) this.uploader.queue[0].remove();
    this.myImg = true;  //表示已经选了图片
  }


  /**
   * 获取分类信息
   * @returns {any}
   */
  public getKindInfo() {
    let url = '/goodsKind/loadGoodsKindById';
    let data = {id: this.submit.getParams('kindId')};
    return this.submit.getData(url, data);
  }


  //提交表单
  addKindForm() {
    let me = this;
    let submitUrl, submitData;
    submitData = Object.assign({},me.kindInfo);
    submitData.taxRate = submitData.taxRate*100 || 0;
    switch (me.path) {
      //新增分类
      case "addKind":
        submitUrl = '/goodsKind/addGoodsKind';
        me.upLoadImg(submitData,submitUrl,'post');//上传图片&提交数据
        break;
      //修改分类
      case "upKind":
        submitUrl = '/goodsKind/updateGoodsKind';
        submitData.kindIcon = null;
        me.upLoadImg(submitData,submitUrl,'put');//上传图片&提交数据
        break;
    }
  }

  /**
   * 上传图片及提交数据
   * @param submitData
   * @param submitUrl
   * @param method : post/put
   */
  public upLoadImg(submitData,submitUrl,method){
    let me = this;
    MaskService.showMask();//上传图片比较慢，显示遮罩层
    //上传之前
    me.uploader.onBuildItemForm = function(fileItem, form){
      me.uuid = me.getUid.getUid();
      form.append('uuid', me.uuid);
    };
    //执行上传
    me.uploader.uploadAll();
    //上传成功
    me.uploader.onSuccessItem = function (item, response, status, headers) {
      let res = JSON.parse(response);
      if (res.success) {
        if (!isNullOrUndefined(me.uuid)) submitData.kindIcon = me.uuid;
      } else {
        AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
      }
    }
    // 上传失败
    me.uploader.onErrorItem = function (item, response, status, headers) {
      AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
    };
    //上传完成，不管成功还是失败
    me.uploader.onCompleteAll = function(){
      me.submitFormDataAndRefresh(submitUrl,submitData,method)
    }

    //如果没有选择图片则直接提交
    if(!me.uploader.isUploading){   // 图片已经传过了，但是数据提交失败了，改过之后可以直接提交
      if (!isNullOrUndefined(me.uuid)) submitData.kindIcon = me.uuid;
      me.submitFormDataAndRefresh(submitUrl,submitData,method);
    }
  }

  /**
   * 提交数据，刷新父当前页组件数据
   * method: post
   * @param submitUrl
   * @param submitData
   */
  public submitFormDataAndRefresh(submitUrl, submitData,method){
    let me = this,pPage,kindPid;
    if(method == 'post'){
      me.submit.postRequest(submitUrl, submitData, true);
    }else if(method == 'put'){
      me.submit.putRequest(submitUrl, submitData, true);
    }
    pPage = this.submit.getParams('page');
    kindPid = this.submit.getParams('kindPid');
    if(isNullOrUndefined(pPage)) pPage = 1;
    if(isNullOrUndefined(kindPid)) kindPid = 0;
    me.parentComp.queryDatas(pPage, kindPid);// 刷新父页面数据
  }

  // 取消
  public cancel() {
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  /**
   * 审核input框的value合不合要求
   */
  auditInputValueForNum(target, type?) {
    this.tools.auditInputValueForNum(target, type);
    if (Number(target.value) > 10000) {
      target.value = 9999.99
    }
  }

}
