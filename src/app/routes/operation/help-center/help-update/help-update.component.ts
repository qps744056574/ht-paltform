import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../../core/settings/settings.service";
import {SubmitService} from "../../../../core/forms/submit.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HelpAnswerComponent} from "../help-answer/help-answer.component";
import { Location }from '@angular/common';
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
declare var $: any;

@Component({
  selector: 'app-help-update',
  templateUrl: './help-update.component.html',
  styleUrls: ['./help-update.component.scss']
})
export class HelpUpdateComponent implements OnInit {
  public contents: string;
  private linkType:string;
  private kinds:any;
  private b:any;
  private abc:any;
  public kindid: number;
  constructor(public settings: SettingsService, private router: Router, private routeInfo: ActivatedRoute,
              private submitt: SubmitService, private tools: RzhtoolsService,private helpAnswerComponent:HelpAnswerComponent,private location: Location) { }

  ngOnInit() {
    let me = this;
    me.kindid = me.routeInfo.snapshot.queryParams['id'];
    me.linkType = me.routeInfo.snapshot.queryParams['linkType'];//获取地址栏的参数
    // 调用富文本编辑器，初始化编辑器
    setTimeout(() => {
      $('#summernote').summernote({ //初始化编辑器
        height: 500,
        dialogsInBody: true,
        callbacks: {
          onChange: (contents, $editable) => {
            this.contents = contents;
          },
          onImageUpload: function (files) {
            for (let file of files) me.sendFile(file);
          }
        }
      });
      $('#summernote').summernote('code', me.b.answer); //编辑器赋值
    }, 0);
    me.qeuryAll();

    //帮助问题修改时，先获取数据
    me.b=me.submitt.getData("/helpQuestions/loadHelpQuestions", {id:me.kindid});
  }

  /**
   * 编辑器上传图片并显示
   * @param file
   */
  sendFile(file) {
    let _this = this, img = _this.tools.uploadImg(file);
    if(!isNullOrUndefined(img)){
      $("#summernote").summernote('insertImage', img, '');
    }
  }

  /**
   * 返回上一页
   */
  back(){
    this.location.back();
  }

  /**
   * 查询分类
   */
  qeuryAll(){
    this.kinds = this.submitt.getData("/helpKind/queryAll",'');
  }

  /**
   * 修改完成后提交
   */
  submit(res){
    var sHTML = $('#summernote').summernote('code')//获取编辑器的值
    let url = '/helpQuestions/updateHelpQuestions';//帮助问题修改
    let data = {
      id:this.b.id,
      question:res.question,
      sort: res.sort,
      answer: sHTML,
    }
    this.abc=this.submitt.putRequest(url, data);
    this.router.navigate(['/main/operation/help-center/help-answer']);
    console.log( this.abc)
  }
}
