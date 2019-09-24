import { Injectable } from '@angular/core';
import { Group, Channel } from '../groups';
import { User } from '../users';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})


export class GroupsService {

  url = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  addNewGroup(group: Group) {
    return this.http.post<any>(this.url + "/api/addGroup", group);
  }

  getGroupsList() {
    return this.http.get<any>(this.url + "/api/allGroupsList");
  }

  updateGroups(groups: Group[]) {
    return this.http.post<any>(this.url + "/api/updateGroups", groups);
  }

  deleteGroup(group) {
    return this.http.post<any>(this.url + "/api/deleteGroup", group);
  }

  checkValidId(groupID) {
    return this.http.post<any>(this.url + "/api/checkvalidgroupid", {'groupID': groupID});
  }

  getGroupUsersList() {
    return this.http.get<any>(this.url + "/api/allGroupUsersList")
  }

  addNewUserToGroup(group: Group, user: User) {
    return this.http.post<any>(this.url + "/api/addUserToGroup", {'group': group, 'user': user});
  }

  deleteUserFromGroup(group: Group, user: User) {
    return this.http.post<any>(this.url + "/api/deleteUserFromGroup", {'group': group, 'user': user});
  }

}
