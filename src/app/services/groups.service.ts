import { Injectable } from '@angular/core';
import { Group } from '../groups';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor() { }

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
