import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BusinessService } from '../../../services/business.service';
import { Business } from '../../../models/business';

@Component({
  selector: 'app-add-edit-business',
  templateUrl: './add-edit-business.component.html',
  styleUrls: ['./add-edit-business.component.css']
})
export class AddEditBusinessComponent implements OnInit {
  addEditForm!: FormGroup;
  businessId!: number;
  modoInsertar: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private businessService: BusinessService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadForm();
    this.loadBusinessDataIfEditMode();
  }

  loadForm() {
    this.addEditForm = this.formBuilder.group({
      name: ['', [Validators.required]] // Nombre del negocio
    });
  }

  loadBusinessDataIfEditMode() {
    this.businessId = +this.activatedRoute.snapshot.params['id'];
    if (this.businessId && this.businessId !== 0) {
      this.modoInsertar = false;
      this.businessService.getBusinessById(this.businessId).subscribe({
        next: (response: Business) => {
          // Directamente usamos `response` como el objeto `Business`
          if (response) {
            this.addEditForm.patchValue({
              name: response.name
            });
            console.log('Datos del negocio cargados para edición:', response);
          } else {
            console.warn('Negocio no encontrado');
          }
        },
        error: (err) => {
          console.error('Error cargando los datos del negocio:', err);
        }
      });
    } else {
      this.modoInsertar = true;
    }
  }

  saveBusiness() {
    const business: Business = this.addEditForm.value;

    if (this.modoInsertar) {
      this.businessService.createBusiness(business).subscribe({
        next: () => this.router.navigate(['/business']),
        error: (err) => console.error('Error al guardar negocio:', err)
      });
    } else {
      this.businessService.updateBusiness(this.businessId, business).subscribe({
        next: () => this.router.navigate(['/business']),
        error: (err) => console.error('Error al actualizar negocio:', err)
      });
    }
  }

  cancel() {
    this.router.navigate(['/business']);
  }
}
