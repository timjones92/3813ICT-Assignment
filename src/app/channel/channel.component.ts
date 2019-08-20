import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Channel } from '../groups';
import { ChannelService } from '../services/channel.service';
import { SocketService } from '../services/socket.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  channelID: number;
  channels: Channel;
  sub;
  today;
  datestamps:string[] = [];

  messagecontent:string = "";
  messages:string[] = [];
  ioConnection:any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private channelService: ChannelService,
    private socketService: SocketService,
    private _location: Location
    ) { }

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(params => {
      this.channelID = +params.get('id');
      this.channels = this.channelService.getChannel(this.channelID);
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
