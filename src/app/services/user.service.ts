import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  addNewUser(user: User) {
    return this.http.post<any>(this.url + "/api/addUser", user);
  }

  getUsersList() {
    return this.http.get<any>(this.url + "/api/allUsersList");
  }

  updateUsers(users: User[]) {
    return this.http.post<any>(this.url + "/api/updateUsers", users);
  }

  updateCurrentUser(user) {
    return this.http.post<any>(this.url + "/api/updateCurrentUser", user);
  }

  deleteUser(user) {
    return this.http.post<any>(this.url + "/api/deleteUser", user);
  }

  checkValidUser(user) {
    return this.http.post<any>(this.url + "/api/checkvaliduser", user);
  }

  checkValidUsername(user) {
    return this.http.post<any>(this.url + "/api/checkvalidusername", user);
  }

  uploadNewAvatar(img) {
    return this.http.post<any>(this.url + "/api/uploadImage", img);
  }

  updateUserAvatar(user, img) {
    return this.http.post<any>(this.url + '/api/updateUserAvatar', {'user': user, 'img': img});
  }

  getUserCounts(user) {
    return this.http.post<any>(this.url + '/api/userCounts', user);
  }

}
