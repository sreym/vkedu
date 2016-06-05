import { Component } from '@angular/core';
import { LocalDbService } from './localdb.service';

@Component({
  selector: 'messages',
  templateUrl: 'app/messages.component.html'  
})
export class MessagesComponent {
  private user = {first_name: "Ivan", last_name: "Ivanov"}
  private group = {name: "Samsung IT"}
}