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

    
    return channel;
  }

  getChannel(id: number) {
    let channels: Channel[] = this.getChannels();
    return channels.find(c => c.channelID === id)
  }
}
