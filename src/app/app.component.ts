import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pw_timecal_front';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Only executes client-side
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login if token is not present
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['home']);
      }
    }
  }
}
