import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatApp';
  
  authenticated: string;

  // Check if current user function
  readLocalStorageValue(key) {
    return localStorage.getItem(key);
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.authenticated = this.readLocalStorageValue('username');
  }

  logout() {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("username");
      
      if (location.href === location.origin + '/') {
        location.reload();
      } else {
        this.router.navigateByUrl('/');
        setTimeout(()=>{
          location.reload();
        }, 100);
        
      }
    }
    
  }
}
