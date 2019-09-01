import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users = [];
  localUsername = "";
  url = "http://localhost:3000/api/getAllUsers/";
  authenticated: string;

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(private http: HttpClient) { }

  currentUser() {
    this.authenticated = this.readLocalStorageValue('username');
    let currUser: string;
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
            currUser = this.users[i]
            
          }
        }
        console.log("Current User:", currUser);
        
      }
    });
    return currUser
  }
}
