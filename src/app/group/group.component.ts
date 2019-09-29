import { Component, OnInit, OnDestroy} from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupsService } from '../services/groups.service';
import { ChannelService } from '../services/channel.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {

  localUsername = "";
  users = [];
  userGroups = [];
  userChannels = [];
  currentUser = {
    '_id': "",
    'username': "",
    'password': "",
    'email': "",
    'role': "",
    'avatar': {}
  };
  authenticated: string;
  fileToUpload: any;
  imgURL: any;
  groupCount: number = 0;
  mySubscription: any;
  
  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(
    private userData: UserService, 
    private groupData: GroupsService, 
    private channelData: ChannelService,
    private router: Router
    ) { 
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      
      this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
        }
      });
    }

  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');

    if (typeof(Storage) !== "undefined"){
      this.localUsername = localStorage.getItem("username");
    }

    // Get all group users
    this.groupData.getGroupUsersList().subscribe(data => {
      this.userGroups = data;
    });

    // Get all channel users
    this.channelData.getChannelUsersList().subscribe(data => {
      this.userChannels = data;
    });

    // Get all users on init load of page
    this.userData.getUsersList().subscribe(data => {
      if (data !== null) {
        this.users = data;
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username === this.localUsername) {
            this.currentUser = this.users[i];
            if (this.userGroups.find(x => x.userID === this.currentUser._id)) {
              this.groupCount = this.userGroups.find(x => x.userID === this.currentUser._id)
              console.log("Current User Group count:", this.groupCount)
            }
          }
        }
        console.log("Current User:", this.currentUser);
      }
    });

    // Get all current users posts
    
    
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  public onFileAdded(event) {
    this.fileToUpload = event.target.files[0];
    var reader = new FileReader();
    if (this.fileToUpload !== undefined) {
      reader.readAsDataURL(this.fileToUpload);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
  }
  
  public onFileSubmit() {
    let formData = new FormData();
    formData.append('uploads[]', this.fileToUpload, this.fileToUpload.name);
    // console.log("File to upload:", this.fileToUpload)
    this.userData.uploadNewAvatar(formData).subscribe(data => {
      console.log(data);
      if (data) {
        var re = "/Users/HPCustomer/3813ICT/Assignment1/ChatApp/server/api";
        this.currentUser.avatar = data.img.replace(re, "");
        this.userData.updateUserAvatar(this.currentUser, data.img.replace(re, "")).subscribe(data => {
          console.log(data);
        });
      }
      
    });
  }
}
