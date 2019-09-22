import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  enteredUsername = "";
  enteredPassword = "";
  authenticated: string;
  users = [];
  error = "";

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }


  constructor(private http: HttpClient, private userData: UserService) { }
  
  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');

    // Get all users on init load of page
    this.userData.getUsersList().subscribe(data => {
      if (data !== null) {
        this.users = data;
      }
    });
  }

  getData() {
    // If entered username in login field is a valid in user storage file
    for (let i = 0; i < this.users.length; i++) {
      if (this.enteredUsername === this.users[i].username) {
        if (this.enteredPassword === this.users[i].password) {
          var currentUser = this.users.find(u => u.username == this.enteredUsername)
          localStorage.setItem("username", currentUser.username);
          location.reload();
        } else {
          this.error = "Incorrect password. Please try again."
        }
      } else {
        this.error = "Not a valid user."
      }
    }
  }
}
