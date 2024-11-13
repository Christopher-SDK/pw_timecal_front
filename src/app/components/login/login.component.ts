import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!:FormGroup;
  hide:boolean=true;

  constructor(
    private formBuilder:FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(){
    this.loadForm();
  }

  loadForm() {
    
    this.loginForm = this.formBuilder.group(
      {
        userName:["", [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
        password:["", [Validators.required, Validators.maxLength(20), Validators.minLength(4)]]
      }
    );

  }

  loginUser() {
    const credentials = {
      userName: this.loginForm.get("userName")!.value,
      password: this.loginForm.get("password")!.value
    };
  
    this.userService.login(credentials).subscribe({
      next: (data) => {
        // Aquí "data" contiene el token, el id del usuario y el rol (type)
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: `Bienvenido!`,
          confirmButtonText: 'OK'
        }).then(() => {
          // Después de la confirmación, redirige al usuario
          this.router.navigate(["/home"]);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: `Hubo un error en la autenticación del usuario: ${err.error.message}`,
          confirmButtonText: 'OK'
        });
        console.error(err);
      }
    });
  }
  
  


  cancel() {
    this.router.navigate(["/"]);    
  }

}
