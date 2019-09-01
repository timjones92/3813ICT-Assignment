import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  enteredUsername = "";
  authenticated: string;
  users = [];
  url = "http://localhost:3000/api/getAllUsers/";
  error = "";

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }


  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');

    // Get all users on init load of page
    this.http.get(this.url).subscribe(data => {
      if (data !== null) {
        this.users = data['users'];
      }
    });
  }

  getData() {
    // If entered username in login field is a valid in user storage file
    for (let i = 0; i < this.users.length; i++) {
      if (this.enteredUsername === this.users[i].username) {
        var currentUser = this.users.find(u => u.username == this.enteredUsername)
        localStorage.setItem("username", currentUser.username);
        location.reload();
      } else {
        this.error = "Not a valid user."
      }
    }
  }
}
