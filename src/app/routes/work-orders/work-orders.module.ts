import {NgModule} from "@angular/core";
import {WoManageComponent} from "./wo-manage/wo-manage.component";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {WoAllComponent} from "./wo-all/wo-all.component";
import {WoService} from "./wo.service";
import {AssignToAgentComponent} from './assign-to-agent/assign-to-agent.component';
import {OrderDetailComponent} from "./order-detail/order-detail.component";
import {OrdersService} from "../orders/orders/orders.service";
import {DeliverComponent} from "./deliver/deliver.component";
import {AfterDetailsComponent} from "./after-details/after-details.component";
import {AfterService} from "../sale/after.service";
import { AssignComponent } from './assign/assign.component';


const routes: Routes = [
  {path: '', redirectTo: 'assign'},
  {path: 'assign', component: AssignComponent,children: [
    {path: 'order-detail', component: OrderDetailComponent},
    {path: 'after-detail', component: AfterDetailsComponent}
  ]},
  {
    path: 'manage', component: WoManageComponent, children: [
    {path: '', redirectTo: 'wo-all'},
    {path: 'wo-all', component: WoAllComponent,children: [
      {path: 'order-detail', component: OrderDetailComponent},
      {path: 'after-detail', component: AfterDetailsComponent}
    ]},
    {path: 'wo-assign', component: WoAllComponent,children: [
      {path: 'order-detail', component: OrderDetailComponent},
      {path: 'after-detail', component: AfterDetailsComponent}
    ]},
    {path: 'wo-assigned', component: WoAllComponent,children: [
      {path: 'order-detail', component: OrderDetailComponent},
      {path: 'after-detail', component: AfterDetailsComponent}
    ]},
    {path: 'wo-my', component: WoAllComponent,children: [
      {path: 'order-detail', component: OrderDetailComponent},
      {path: 'after-detail', component: AfterDetailsComponent}
    ]},
    {path: 'wo-deal', component: WoAllComponent,children: [
      {path: 'order-detail', component: OrderDetailComponent},
      {path: 'after-detail', component: AfterDetailsComponent}
    ]},
    {path: 'wo-finished', component: WoAllComponent,children: [
      {path: 'order-detail', component: OrderDetailComponent},
      {path: 'after-detail', component: AfterDetailsComponent}
    ]},
    {path: 'wo-abnormal', component: WoAllComponent,children: [
      {path: 'order-detail', component: OrderDetailComponent},
      {path: 'after-detail', component: AfterDetailsComponent}
    ]},

  ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    WoManageComponent,
    WoAllComponent,
    AssignToAgentComponent,
    OrderDetailComponent,
    DeliverComponent,
    AfterDetailsComponent,
    AssignComponent
  ],
  providers: [WoManageComponent, WoService, OrdersService, AfterService]
})
export class WorkOrdersModule {
}
