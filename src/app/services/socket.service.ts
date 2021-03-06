import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs'
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

  public initSocket(user): void {
    this.socket = io(SERVER_URL);
    setTimeout(() => {
      this.broadcastNewUser(this.socket.id, user);
    }, 300);
    
  }

  public broadcastNewUser(socket, user) {
    this.socket.emit('broadcast', {socket, user});
  }

  public onBroadcast(): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.on('broadcast', (data) => observer.next(data));
    });
    return observable;
  }

  onLeaveChannel(broadcast: Subscription) {
    return broadcast.unsubscribe();
  }

  public send(message: string, timestamp, channel: Channel, user: User): void {
    this.socket.emit('message', {message, timestamp, channel, user});
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

  public addNewChannelImage(message: string, timestamp, channel: Channel, user: User) {
    return this.http.post<any>("http://localhost:3000/api/addNewChatImage", {'message': message, 'timestamp': timestamp, 'channel': channel, 'user': user});
  }
}