import {NgModule} from "@angular/core";
import {PublishComponent} from "./publish/publish.component";
import {ManageComponent} from "./manage/manage.component";
import {BrandsComponent} from "./brands/brands.component";
import {KindManageComponent} from "./kind-manage/kind-manage.component";
import {PropertiesComponent} from "./properties/properties.component";
import {RouterModule, Routes} from "@angular/router";
import {AddKindComponent} from "./add-kind/add-kind.component";
import {SharedModule} from "../../shared/shared.module";
import { AddBrandComponent } from './add-brand/add-brand.component';

// 父路由，用于页面嵌套显示
const routes: Routes = [
  {path: '', redirectTo: 'publish'},
  {path: 'publish', component: PublishComponent},
  {path: 'manage', component: ManageComponent},
  {path: 'kind-manage', component: KindManageComponent,children: [
    {path: 'addKind', component: AddKindComponent},
    {path: 'upKind/:kindId', component: AddKindComponent}
  ]},
  {path: 'properties', component: PropertiesComponent},
  {path: 'brands', component: BrandsComponent,children: [
    {path: 'addBrand', component: AddBrandComponent},
    {path: 'upBrand/:brandId', component: AddBrandComponent},
    {path: 'brandDetail/:brandId', component: AddBrandComponent}
  ]}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PublishComponent,
    ManageComponent,
    BrandsComponent,
    KindManageComponent,
    PropertiesComponent,
    AddKindComponent,
    AddBrandComponent
  ]
})
export class GoodsModule {
}
