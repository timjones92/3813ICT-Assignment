import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Channel } from '../groups';
import { ChannelService } from '../services/channel.service';
import { SocketService } from '../services/socket.service';
import { Location } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  
  container: HTMLElement;
  channelID: number;
  channels: [Channel];
  selectedChannel: Channel;
  sub;
  today;
  datestamps:string[] = [];
  currentUser = {
    '_id': "",
    'username': "",
    'password': "",
    'email': "",
    'role': "",
    'avatar': ""
  };
  authenticated: string;
  localUsername = "";
  users = [];

  messagecontent:string = "";
  messages:any[] = [];
  ioConnection:any;

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private _location: Location,
    private channelData: ChannelService,
    private userData: UserService
    ) { }

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(params => {
      this.channelID = +params.get('id');
      
    });
    // Get all channels on init load of page
    this.channelData.getChannelsList().subscribe(data => {
      if (data !== null) {
        this.channels = data;
        for (let i = 0; i < this.channels.length; i++) {
          if (this.channels[i].channelID === this.channelID) {
            this.selectedChannel = this.channels[i];
            this.socketService.getAllChannelMessages(this.selectedChannel).subscribe(data => {
              if (data !== null) {
                this.messages = data;
                console.log(this.messages)
              }
            });
            console.log("Selected Channel is:", this.selectedChannel)
          }
        }
      }
    });
    
    this.authenticated = this.readLocalStorageValue('username');

    if (typeof(Storage) !== "undefined"){
      this.localUsername = localStorage.getItem("username");
    }

    // Get all users on init load of page
    this.userData.getUsersList().subscribe(data => {
      if (data !== null) {
        this.users = data;
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username === this.localUsername) {
            this.currentUser = this.users[i];
            console.log("Current User is:", this.currentUser)
          }
        }
      }
    });

    this.initToConnection();
  }

  // Connect to io socket at server
  private initToConnection() {
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage().subscribe((message) => {
      // console.log("Message user id", message.user._id);
      let newMsg = {
        'message':message.message,
        'timestamp': message.timestamp,
        'channelID': message.channel.channelID,
        'channelName': message.channel.channelName,
        'userID': message.user._id,
        'username': message.user.username,
        'userimg': message.user.avatar
      }
      console.log(newMsg)
      this.messages.push(newMsg);
    });
  }

  // Send message content to socket service 
  private chat(){
    if (this.messagecontent) {
      this.today = Date.now();
      this.datestamps.push(this.today);
      this.socketService.send(this.messagecontent, this.today, this.selectedChannel, this.currentUser);
      this.socketService.addNewChannelMessage(this.messagecontent, this.today, this.selectedChannel, this.currentUser).subscribe(data => {
        console.log("success!")
      });
      this.messagecontent = null;
    } else {
      console.log("no message");
    }
  }

  // Delete channel chat history
  private deleteChatHistory(channel: Channel) {
    if (confirm("Are you sure you want to delete all chat history in" + channel.channelName + '?')) {
      this.socketService.deleteAllChannelMessages(channel).subscribe(data => {
        this.messages = data;
        console.log("Deleted all channel chat history")
      });
    }
  }
  
  // Go back to previous URL
  private goBack() {
    this._location.back();
  }
}
