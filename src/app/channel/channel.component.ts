import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Channel } from '../groups';
import { SocketService } from '../services/socket.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  channelID: number;
  channels: [Channel];
  selectedChannel: Channel;
  sub;
  today;
  datestamps:string[] = [];
  url = "http://localhost:3000/api/getAllChannels/";

  messagecontent:string = "";
  messages:string[] = [];
  ioConnection:any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private socketService: SocketService,
    private _location: Location,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(params => {
      this.channelID = +params.get('id');
      
    });
    // Get all channels on init load of page
    this.http.get(this.url).subscribe(data => {
      if (data !== null) {
        this.channels = data['channels'];
        for (let i = 0; i < this.channels.length; i++) {
          if (this.channels[i].channelID === this.channelID) {
            this.selectedChannel = this.channels[i];
            console.log("Selected Channel is:", this.selectedChannel)
          }
        }
      }
    });
    
    this.initToConnection();
  }

  private initToConnection() {
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage().subscribe((message:string) => {
      this.messages.push(message);
    });
  }

  private chat(){
    if (this.messagecontent) {
      this.socketService.send(this.messagecontent);
      this.messagecontent = null;
      this.today = Date.now();
      this.datestamps.push(this.today);
    } else {
      console.log("no message");
    }
  }

  private goBack() {
    this._location.back();
  }
}
