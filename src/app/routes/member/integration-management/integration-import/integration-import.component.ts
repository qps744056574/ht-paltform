import {Component, OnInit} from "@angular/core";
import {FileUploader} from "ng2-file-upload";
import {SubmitService} from "../../../../core/forms/submit.service";
import {AppComponent} from "../../../../app.component";
import {MaskService} from "../../../../core/services/mask.service";
const swal = require('sweetalert');
declare var $: any;
@Component({
  selector: 'app-integration-import',
  templateUrl: './integration-import.component.html',
  styleUrls: ['./integration-import.component.scss']
})
export class IntegrationImportComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({//初始化上传方法
    url: '/upload/local/file',
    itemAlias:"file",
    allowedFileType: ["xls"]
  });
  progress: number;//进度条
  public errorFile: string;
  public templateFile: string ="http://ovaetuonu.bkt.clouddn.com/templateCoin.xlsx";
  public onOff: boolean = false;
  constructor(public submitt:SubmitService) { }

  ngOnInit() {
  }
 //清空选中的表格
  changeFiles(){
    this.onOff = true;
    if(this.uploader.queue.length > 1) this.uploader.queue[0].remove();
  }

  //上传
  public upLoadExcel(){
    let me = this;
  if(this.onOff){
    this.onOff = false;
    MaskService.showMask();//上传表格比较慢，显示遮罩层
    //执行上传
    me.uploader.uploadAll();
    //上传成功
    me.uploader.onSuccessItem = function (item, response, status, headers) {
      let res = JSON.parse(response);
      if (res.success) {
        me.iimport(res.data);//上传成功后导入
        me.uploader.removeFromQueue(item);
        setTimeout(()=>{
          me.uploader.progress=0;
        },0);
      } else {
        AppComponent.rzhAlt('error','表格失败','表格上传失败！');
      }
    }
    // 上传失败
    me.uploader.onErrorItem = function (item, response, status, headers) {
      AppComponent.rzhAlt('error','表格失败', '表格上传失败！');
    };
  }
  }
  //导入
  public iimport(uid){
    let url = '/custCoin/importCoin';
    let data = {
      uid:uid
    }
    let result=this.submitt.postRequest(url, data,false);
    this.errorFile = result;
  }
}
