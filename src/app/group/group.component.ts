import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  localUsername = "";
  users = [];
  currentUser = {};
  authenticated: string;

  url = "http://localhost:3000/api/getAllUsers/";
  
  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');

    if (typeof(Storage) !== "undefined"){
      this.localUsername = localStorage.getItem("username");
    }
    
    // Get all users on init load of page
    this.http.get(this.url).subscribe(data => {
      if (data !== null) {
        this.users = data['users'];
        // Get current user from all users and add to variable `currentUser`
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username === this.localUsername) {
            this.currentUser = this.users[i]
          }
        }
        console.log("Current User:", this.currentUser);
      }
    });
  }

}
