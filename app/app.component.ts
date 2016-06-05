import { Component, OnInit } from '@angular/core';
import { provide } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { UserComponent } from './user.component';
import { GroupsComponent } from './groups.component';
import { GroupDetailComponent } from './group-detail.component';
import { VkService} from './vk.service.ts';
import { LocalDbService } from './localdb.service';
import { MessagesComponent } from './messages.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  directives: [ UserComponent, GroupsComponent, ROUTER_DIRECTIVES ],
  providers: [ VkService, LocalDbService, ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]
})
@RouteConfig([
  {
    path: '/groups',
    name: 'Groups',
    component: GroupsComponent,
    useAsDefault: true
  },
  {
    path: '/groups/:id',
    name: 'Group',
    component: GroupDetailComponent
  },
  {
    path: '/groups/:id/:user',
    name: 'Messages',
    component: MessagesComponent
  }
])
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  
  ngOnInit() { }
}