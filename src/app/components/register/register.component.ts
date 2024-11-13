import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BusinessService } from '../../services/business.service';
import { User } from '../../models/user';
import { Business } from '../../models/business'; // Nueva importación
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hide: boolean = true;
  businesses: Business[] = []; // Arreglo para almacenar empresas

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private businessService: BusinessService, // Inyección de BusinessService
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadForm();
    this.loadBusinesses(); // Cargar empresas
  }

  loadForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      birthdate: ['', Validators.required],
      userName: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(4),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(6),
        ],
      ],
      type: ['', Validators.required],
      businessId: ['', Validators.required], // Campo para el ID de la empresa
    });
  }

  loadBusinesses() {
    this.businessService.getAllBusinesses().subscribe({
      next: (data) => {
        this.businesses = data;
      },
      error: (err) => {
        console.error("Error al cargar las empresas: ", err);
        this.snackBar.open('No se pudieron cargar las empresas', 'OK', { duration: 3000 });
      },
    });
  }

  registerUser() {
    const user: User = {
      id: 0,
      userName: this.registerForm.get('userName')!.value,
      password: this.registerForm.get('password')!.value,
      firstName: this.registerForm.get('firstName')!.value,
      lastName: this.registerForm.get('lastName')!.value,
      birthdate: this.registerForm.get('birthdate')!.value,
      type: this.registerForm.get('type')!.value,
      businessId: this.registerForm.get('businessId')!.value, // Asigna la empresa seleccionada
    };

    this.userService.addUser(user).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'El usuario se registró correctamente',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: `Hubo un error en el registro del usuario: ${err.error.message}`,
          confirmButtonText: 'OK',
        });
      },
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
