import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { VkService } from './vk.service.ts';
import { LocalDbService } from './localdb.service';
import { UserDetailComponent } from './user-detail.component';

const async = require('async');

@Component({
  selector: 'group-detail',
  templateUrl: 'app/group-detail.component.html',
  directives: [UserDetailComponent, ROUTER_DIRECTIVES]
})
export class GroupDetailComponent implements OnInit {   
  private id: string;
  private usersList = [];
  
  constructor(public $vk: VkService, public routeParams: RouteParams, public $localdb: LocalDbService, private ref: ChangeDetectorRef) {
  }
  
  ngOnInit() {
    this.id = this.routeParams.get('id');
    
    this.usersList.length = 0;
    
    this.$vk.getGroupUsers(this.id).subscribe( users => {
      async.eachSeries(users, (user, callback) => {
        this.$localdb.getUser(user.id).subscribe(luser => {
          if (luser) {
            user.first_name = luser.first_name;
            user.last_name = luser.last_name;
          }
          callback(null);
        });                
      }, () => {
        this.usersList = users;
        this.ref.detectChanges();
      });
    });
  }
}