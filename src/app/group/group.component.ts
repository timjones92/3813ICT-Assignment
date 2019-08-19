import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  allGroups = "";
  groups:string[] = [];
  allChannels = "";
  channels:string[] = [];

  constructor() { }

  ngOnInit() {
    if (typeof(Storage) !== "undefined"){
      this.allGroups = JSON.parse(localStorage.getItem("groups"));
      this.allChannels = JSON.parse(localStorage.getItem("channels"));
    }
    
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
