import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService} from '../services/user.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('noticeState', [
      state('show', style({
        opacity:1,
        display:'block'
      })),
      state('hide', style({
        opacity:0,
        display:'none'
      })),
      transition('show => hide',animate('1000ms ease-out')),
      transition('hide => show', animate('400ms ease-in')),
    ])
  ]
})
export class LoginComponent implements OnInit {

  enteredUsername = "";
  enteredPassword = "";
  authenticated: string;
  users = [];
  error = "";
  validUserMessage: string = "";
  noticeshow: boolean = false;

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

  get noticeName() {
    return this.noticeshow ? 'show':'hide';
  }


  getData(event) {
    event.preventDefault();
    
    this.noticeshow = false;
      this.userData.checkValidUser({'username':this.enteredUsername, 'password':this.enteredPassword}).subscribe(data => {
        if (data.success == 0) {
          this.validUserMessage = "Invalid username or incorrect password. Please try again.";
          this.noticeshow = !this.noticeshow;
        } else {
          this.noticeshow = false;
          this.validUserMessage = null;
          localStorage.setItem("username", this.enteredUsername);
          location.reload();
        }
      });
      
  }
  //   // If entered username in login field is a valid in user storage file
  //   for (let i = 0; i < this.users.length; i++) {
  //     if (this.enteredUsername === this.users[i].username) {
  //       if (this.enteredPassword === this.users[i].password) {
  //         var currentUser = this.users.find(u => u.username == this.enteredUsername)
  //         localStorage.setItem("username", currentUser.username);
  //         location.reload();
  //       } else {
  //         this.error = "Incorrect password. Please try again."
  //       }
  //     } else {
  //       this.error = "Not a valid user."
  //     }
  //   }
  // }
}
