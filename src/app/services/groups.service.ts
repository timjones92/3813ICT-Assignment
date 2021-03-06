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

  getGroupUsersList() {
    return this.http.get<any>(this.url + "/api/allGroupUsersList")
  }

  addNewUserToGroup(group: Group, user: User) {
    return this.http.post<any>(this.url + "/api/addUserToGroup", {'group': group, 'user': user});
  }

  deleteUserFromGroup(group: Group, user: User) {
    return this.http.post<any>(this.url + "/api/deleteUserFromGroup", {'group': group, 'user': user});
  }

  addGroupAssis(group: Group, user: User) {
    return this.http.post<any>(this.url + "/api/addNewGroupAssis", {'group': group, 'user': user});
  }

  deleteGroupAssis(groupAssis) {
    return this.http.post<any>(this.url + "/api/deleteGroupAssis", groupAssis);
  }

  getGroupAssisList() {
    return this.http.get<any>(this.url + "/api/getGroupAssisList");
  }
}
