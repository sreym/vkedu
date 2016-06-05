import { Component, Input, OnInit } from '@angular/core';
import { VkService} from './vk.service.ts';

@Component({
  selector: 'user',
  templateUrl: 'app/user.component.html'
})
export class UserComponent implements OnInit {
  public $user: any = {}
  
  constructor(public $vk: VkService) {}
  
  ngOnInit() { 
    this.$vk.getCurrentUser().subscribe(user => this.$user = user);
  }
}