import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatApp';

  constructor(private router: Router) {}

  logout() {
    alert("Are you sure you want to log out?");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("groups");
    localStorage.removeItem("channels");
    this.router.navigateByUrl('/');
    location.reload();
  }
}
