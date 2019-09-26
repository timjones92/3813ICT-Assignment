import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import * as io from 'socket.io-client';
import { Channel } from '../groups';
import { User } from '../users';
import { HttpClient } from '@angular/common/http';
const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  constructor(private http: HttpClient) { }

  public initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  public send(message: string): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => observer.next(data));
    });
    return observable;
  }

  public addNewChannelMessage(message: string, timestamp, channel: Channel, user: User) {
    return this.http.post<any>("http://localhost:3000/api/newChannelMessage", {'message': message, 'timestamp': timestamp, 'channel': channel, 'user': user});
  }

  public getAllChannelMessages(channel) {
    return this.http.post<any>("http://localhost:3000/api/allChannelMessages", channel);
  }

  public deleteAllChannelMessages(channel) {
    return this.http.post<any>("http://localhost:3000/api/deleteAllChannelMessages", channel);
  }
}