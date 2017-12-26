import {Component, OnInit} from "@angular/core";
import {isNullOrUndefined, isUndefined} from "util";
import {SubmitService} from "../../../../core/forms/submit.service";
import {GoodsService} from "../../goods.service";
import {RzhtoolsService} from "../../../../core/services/rzhtools.service";
import {MaskService} from "../../../../core/services/mask.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
declare var $: any;

@Component({
  selector: 'app-audit-store-goods',
  templateUrl: './audit-store-goods.component.html',
  styleUrls: ['./audit-store-goods.component.scss']
})
export class AuditStoreGoodsComponent implements OnInit {
  public path: string;           //当前路由
  public kindId: string;         //商品分类id
  public saleAttrList: any;       // 所有规格数据
  public brandsList: any;        // 品牌列表
  public unitList: any;           // 计量单位列表
  public baseAttrList: any;      // 商品基本属性列表
  public goodsBaseCode: string;  //商品基本编码
  public enum: any;              // 所选规格，用于请求sku接口的数据
  public skuAttr = [];           //属性列表
  public skuImg: any;            // 图片属性
  public oldImgs: any = {};        // 商品已经有的图片列表
  public goodsEditData: any;     // 修改商品时商品的原有数据
  public tempMblHtml: string;    // 修改商品时临时用的移动端详情
  public myReadOnly: boolean = true;     // 商品详情或审核商品时是只读状态
  public goodsBody: any;          //商品详情
  public mobileBody: any;          //移动端商品详情
  public audit: any;              // 商品审核
  public goodsAudits: any;        // 商品审核状态列表
  public storeCode: string;          //店铺编码
  public logistics: any;             // 物流规则列表
  public tplVals: any;               // 运费模板内容
  public unit: string = '件';       // 运费价格
  public refresh: boolean;         // 是否刷新父组件数据
  public publishData: any = {
    goodsExpressInfo: {
      freightType: null,
      fixedFreight: null,
      expressTplId: null
    },
    goodsImagesList: [],
    goodsBaseAttrList: [],
    goodsSkuList: []
  };// 商品发布数据，所有数据
  constructor(public route: ActivatedRoute,
              public location: Location,
              public submit: SubmitService,
              public goods: GoodsService,
              public router: Router,
              public tools: RzhtoolsService) {
  }
  back(){
    this.location.back()
  }

  ngOnInit() {
    let me = this;
    me.goodsBaseCode = me.submit.getParams('baseCode');

    me.route.url.subscribe(paths => {
      me.path = paths[0].path;
    })
    me.getPageData();// 获取当前页面需要的数据
    me.goodsAudits = this.tools.getEnumDataList('1014');  // 商品审核状态列表
    // 去掉待审核状态
    for (var i = me.goodsAudits.length - 1; i >= 0; i--) {
      var obj = me.goodsAudits[i];
      if (obj.key == 'AUDIT') {
        me.goodsAudits.splice(i, 1)
      }
    }
    // 初始化默认审核状态
    me.audit = {
      opinion: '',
      result: 'PASS',
      goodsBaseCode: me.goodsBaseCode
    }
    /**
     * JQuery初始化后执行事件
     */
    $(function () {
      //调用富文本编辑器，初始化编辑器
      $('#goodsBody').summernote({
        toolbar: [],
        height: 600
      });
      $('#mobileBody').summernote({
        toolbar: [],
        height: 420
      });
      if (!isNullOrUndefined(me.goodsBody)) $('#goodsBody').summernote('code', me.goodsBody);   //PC端详情
      if (!isNullOrUndefined(me.mobileBody)) $('#mobileBody').summernote('code', me.mobileBody);   //移动端详情
    })

    //初始化图片上传属性对象,后续需要往vals里添加对象，做此初始配置可保HTML与后续添加时不报错
    me.skuImg = {
      attrName: '',
      vals: []
    };
  }

  /**
   * 获取发布页面所需数据
   */
  public getPageData() {
    let me = this, pageData;
    pageData = me.submit.getData('/goodsQuery/pageDataEdit', {goodsBaseCode: me.goodsBaseCode});
    if (!isNullOrUndefined(pageData)) {
      me.allotPageData(pageData);  //分配获取的页面数据
    }
  }

  /**
   * 分配获取的页面数据
   * @param pageData
   */
  public allotPageData(pageData) {
    let me = this;
    // 商品基本基本信息
    me.baseAttrList = pageData.baseAttrList;      // 商品基本属性
    me.unitList = pageData.unitList;              // 计量单位
    me.brandsList = pageData.brandList;           // 品牌列表
    me.saleAttrList = pageData.saleAttrList;      // 规格
    me.goodsEditData = pageData.goodsSave;
    me.publishData = me.goodsEditData;                  // 商品发布数据
    me.genClearArray(me.goodsEditData.goodsSkuList);    // 生成所选属性组合
    me.goodsBody = me.goodsEditData.goodsBody.replace(/\\/, '');
    me.mobileBody = me.goodsEditData.mobileBody.replace(/\\/, '');
    if (!isNullOrUndefined(me.publishData.goodsExpressInfo) && !isNullOrUndefined(me.publishData.goodsExpressInfo.expressTplId)) {
      me.getExpressTpl(pageData.storeCode); //获取物流模板
      me.getTplValById();  //根据物流模板ID获取模板值
    }
  }

  /**
   * 获取运费模板
   */
  getExpressTpl(storeCode) {
    let me = this;
    let expressTpl = me.goods.getExpressTplByStoreCode(storeCode);// 获取运费模板
    if (!isNullOrUndefined(expressTpl)) me.logistics = expressTpl;
  }

  /**
   * 根据运费模板ID获取模板内容
   * @param tplId
   */
  getTplValById() {
    let me = this, tplId = me.publishData.goodsExpressInfo.expressTplId;
    let result = me.getTplVal(tplId);
    if (!isNullOrUndefined(result)) me.tplVals = result;
    if (!isNullOrUndefined(me.tplVals)){
      if(me.tplVals.valuationType == 'VOLUME') {
        me.unit = 'm³'
      } else if (me.tplVals.valuationType == 'WEIGHT') {
        me.unit = 'kg'
      } else {
        me.unit = '件'
      }
    }else{
      me.publishData.isFreight = 'N'
    }
  }

  /**
   * 根据运费模板ID获取运费模板值
   * @param tplId   运费模板ID
   * @returns {any}   运费模板值
   */
  public getTplVal(tplId) {
    let me = this;
    for (let tpl of me.logistics ) {
      if (tpl.id == tplId) {
        return tpl;
      }
    }
  }

  /**
   * 如果是第一个规格，则改变图片列表的选值数组
   * @param $obj
   */
  public genImgSku($obj) {
    let me = this;
    let checkedAttr = $obj.parents('.enumType').find('._val:checked');  //选中的第一个规格的数量
    if (checkedAttr.length > 0) {     //选择的规格属大于0时，获取所选属性的名和值
      me.skuImg.attrName = $obj.parents('.enumType').find('._attrName').next().find('input').val();
      me.skuImg.attrCode = $obj.parents('.enumType').find('._attrName').next().find('input').attr('id');
    }
    let $val = $obj.parents('._attr').find('._value').next().find('input'); // 取到所选中的多选框对应的输入框，以便从中取值
    let targetCheckBoxObj = $obj.parents('._attr').find('._val');           // 当前选择或修改的属性的checkBox的jQ对象
    // 当前元素被选中，判断属性组中这是否已经有了这个分组
    if (targetCheckBoxObj.prop('checked')) {
      if (me.checkImgListIfHadGroup($val.attr('id')).isHad) {
        let groupId = me.checkImgListIfHadGroup($val.attr('id')).groupId;
        me.skuImg.vals[groupId].valName = $val.val();
      } else {
        let obj = {
          attrCode: me.skuImg.attrCode,
          valCode: $val.attr('id'),
          valName: $val.val(),
          idx: $val.attr('name')
        };
        me.skuImg.vals.push(obj);
      }
    }
  }

  /**
   * 检测图片属性列表中是否已经有了这个属性
   * @param compareVal 用来比较的值
   * @returns {{groupId: number, isHad: boolean}}
   */
  public checkImgListIfHadGroup(compareVal) {
    let me = this, groupId: number, isHad = false;
    me.skuImg.vals.forEach((item, i) => {
      if (item.valCode == compareVal) {
        groupId = i;
        isHad = true;
      }
    })
    return {
      groupId: groupId,
      isHad: isHad
    };
  }


  /**
   * 比较两个数字的大小
   * @param arg1
   * @param arg2
   * @returns {boolean}
   */
  compareNumber(arg1: string, arg2: string) {
    let num1 = Number(arg1), num2 = Number(arg2);
    if (num1 < num2 || num1 == num2) return true;
  }

  /**
   * 将数据生成易解析的新数组
   * @param skuData
   */
  public genClearArray(skuData) {
    let me = this;
    me.skuAttr = [];
    if (skuData.length > 0) {
      me.publishData.goodsSkuList = skuData;
      let tempSkuAttr = skuData[0].attrsList;
      tempSkuAttr.forEach((attr) => {
        let obj = {
          attrCode: attr.attrCode,
          attrName: attr.attrName,
          idx: attr.idx
        };
        me.skuAttr.push(obj);
      });
    } else {
      me.publishData.goodsSkuList = [];
    }
  }

  /**
   * 审核商品
   */
  auditGoods() {
    let me = this;
    MaskService.showMask();//显示遮罩层
    me.goods.putRequest('/goodsEdit/auditGoods', me.audit, true)
    me.refresh = true;
  }

}
