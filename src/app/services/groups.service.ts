import { Injectable } from '@angular/core';
import { Group } from '../groups';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})


export class GroupsService {

  url = "http://localhost:4200/"

  constructor(private http: HttpClient) { }

  getGroups() {
    let groups: Group[];

    // Initial Groups
    groups = [
      new Group("B-Sharps"), 
      new Group("AlphaOmega")
    ];

    return groups;

  }

  

}
