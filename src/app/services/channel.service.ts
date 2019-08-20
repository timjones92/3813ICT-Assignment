import { Injectable } from '@angular/core';
import { Channel } from '../groups';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor() { }

  getChannels() {
    //Initial Channels
    let channel: Channel[];

    channel = [
      new Channel("B-Sharps", 0, "Homer"),
      new Channel("B-Sharps", 1, "Skinner"),
      new Channel("AlphaOmega", 2, "Squadron")
    ]
    
    return channel;
  }

  getChannel(id: number) {
    let channels: Channel[] = this.getChannels();
    return channels.find(c => c.channelID === id)
  }
}
