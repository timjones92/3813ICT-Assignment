import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  username = "";
  allGroups = "";
  groups:string[] = [];
  allChannels = "";
  channels:string[] = [];

  authenticated: string;

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor() { }

  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');

    if (typeof(Storage) !== "undefined"){
      this.username = localStorage.getItem("username");
      this.allGroups = JSON.parse(localStorage.getItem("groups"));
      this.allChannels = JSON.parse(localStorage.getItem("channels"));

      // Push all groups to groups list
      for (let i = 0; i < this.allGroups.length; i++) {
        this.groups.push(this.allGroups[i]);
      }
      
      // Push all channels to channels list
      for (let i = 0; i < this.allChannels.length; i++) {
        this.channels.push(this.allChannels[i]);
      }
    }
  }

}
