import { Injectable } from '@angular/core';
import { Channel } from '../groups';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  url = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  addNewChannel(channel: Channel) {
    return this.http.post<any>(this.url + "/api/addChannel", channel);
  }

  getChannelsList() {
    return this.http.get<any>(this.url + "/api/allChannelsList");
  }

  updateChannels(channels: Channel[]) {
    return this.http.post<any>(this.url + "/api/updateChannels", channels);
  }

  deleteChannel(channel: Channel) {
    return this.http.post<any>(this.url + "/api/deleteChannel", channel);
  }

}
