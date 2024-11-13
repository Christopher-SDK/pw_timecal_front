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
    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Si no hay token, redirigir al login
        this.router.navigate(['login']);
      } else {
        this.router.navigate(['home']);
      }
    }
  }
}
