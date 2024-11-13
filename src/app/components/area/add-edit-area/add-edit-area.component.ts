import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AreaService } from '../../../services/area.service';
import { BusinessService } from '../../../services/business.service';
import { Area } from '../../../models/area';
import { Business } from '../../../models/business';

@Component({
  selector: 'app-add-edit-area',
  templateUrl: './add-edit-area.component.html',
  styleUrls: ['./add-edit-area.component.css']
})
export class AddEditAreaComponent implements OnInit {
  addEditForm!: FormGroup;
  areaId!: number;
  modoInsertar: boolean = true;
  businesses: Business[] = []; // Lista de negocios para el combo box
  businessIdFromStorage!: number; // ID del negocio desde localStorage

  constructor(
    private formBuilder: FormBuilder,
    private areaService: AreaService,
    private businessService: BusinessService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadForm();
    this.loadBusinessIdFromStorage();
    this.loadBusinesses().then(() => this.loadAreaDataIfEditMode());
  }

  loadForm() {
    this.addEditForm = this.formBuilder.group({
      name: ['', [Validators.required]], // Nombre del área
      businessId: ['', [Validators.required]] // ID del negocio seleccionado
    });
  }

  loadBusinessIdFromStorage() {
    const businessId = localStorage.getItem('business_id');
    if (businessId) {
      this.businessIdFromStorage = +businessId;
    }
  }

  loadBusinesses(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.businessService.getAllBusinesses().subscribe({
        next: (data: Business[]) => {
          // Filtra los negocios para mostrar solo el que coincide con el ID del localStorage
          this.businesses = data.filter(business => business.businessId === this.businessIdFromStorage);
          resolve();
        },
        error: (err) => {
          console.error('Error cargando negocios:', err);
          reject(err);
        }
      });
    });
  }

  loadAreaDataIfEditMode() {
    this.areaId = +this.activatedRoute.snapshot.params['id'];
    if (this.areaId && this.areaId !== 0) {
      this.modoInsertar = false;
      this.areaService.getAreaById(this.areaId).subscribe({
        next: (response: Area) => {
          // Asigna el valor directamente si la estructura de respuesta es el objeto del área
          if (response) {
            this.addEditForm.patchValue({
              name: response.name,
              businessId: response.businessId
            });
          } else {
            console.warn('Área no encontrada');
          }
        },
        error: (err) => {
          console.error('Error cargando los datos del área:', err);
        }
      });
    }
  }

  saveArea() {
    const area: Area = this.addEditForm.value;
    if (this.modoInsertar) {
      this.areaService.createArea(area).subscribe({
        next: () => this.router.navigate(['/area']),
        error: (err) => console.error('Error al guardar área:', err)
      });
    } else {
      this.areaService.updateArea(this.areaId, area).subscribe({
        next: () => this.router.navigate(['/area']),
        error: (err) => console.error('Error al actualizar área:', err)
      });
    }
  }

  cancel() {
    this.router.navigate(['/area']);
  }
}
