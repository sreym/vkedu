import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { VkService } from './vk.service.ts';

@Component({
  selector: 'groups',
  templateUrl: 'app/groups.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class GroupsComponent implements OnInit {
  public groupsList = [];
   
  constructor(public $vk: VkService) {}
  
  ngOnInit() { 
    this.$vk.getUserGroups().subscribe(groups => {
      this.groupsList = groups;
    });
  }
}