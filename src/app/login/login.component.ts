import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { User } from '../users';
import { Group, Channel } from '../groups';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = "";
  
  // Initial Groups
  group = [
    new Group("B-Sharps"), 
    new Group("AlphaOmega")
  ];
  
  //Initial Channels
  channel = [
    new Channel(this.group[0].groupName, "Homer"),
    new Channel(this.group[0].groupName, "Skinner"),
    new Channel(this.group[1].groupName, "Squadron")
  ];

  // Initial Super User
  users = [
    new User("Super", "superadmin@chatapp.com", "SuperAdmin", this.group, this.channel)
  ]

  constructor(private router:Router) { }
  
  ngOnInit(){
    console.log(this.users)
  }

  getData() {
    var getUser = this.username;
    var groupList = []
    var channelList = []

    if (this.users.some(person => (person.username == getUser))) {
      var currentUser = this.users.find(u => u.username == this.username)
      localStorage.setItem("username", currentUser.username);
      localStorage.setItem("email", currentUser.email);
      localStorage.setItem("role", currentUser.role);
      for (let i = 0; i < currentUser.groups.length; i++) {
        groupList.push(currentUser.groups[i].groupName);
      }
      localStorage.setItem("groups", JSON.stringify(groupList));
      for (let i = 0; i < currentUser.channels.length; i++) {
        var storeChannel = {group: "", name: ""}
        storeChannel.group = currentUser.channels[i].groupName;
        storeChannel.name = currentUser.channels[i].channelName;
        channelList.push(storeChannel)
      }
      localStorage.setItem("channels", JSON.stringify(channelList));
      location.reload();
    }
  }
}
