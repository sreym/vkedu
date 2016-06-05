declare var $: any;

import { Component } from '@angular/core';
import { LocalDbService } from './localdb.service';

@Component({
  selector: 'user-detail',
  templateUrl: 'app/user-detail.component.html'
})
export class UserDetailComponent {
  private $user = {
    first_name: '',
    last_name: '',
    id: 0
  };
  
  constructor(private $localdb: LocalDbService) { }
  
  show(user) {
    $('#editUser').modal('show')
    this.$user = user;
  }
  
  saveChanges() {
    this.$localdb.newOrReplaceName(this.$user.id, this.$user.first_name, this.$user.last_name);
    $('#editUser').modal('hide');
  }  
}