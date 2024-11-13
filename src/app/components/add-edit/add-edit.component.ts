import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InstrumentService } from '../../services/instrument.service';
import { AreaService } from '../../services/area.service';
import { Instrument } from '../../models/instruments';
import { Area } from '../../models/area';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditComponent implements OnInit {
  addEditForm!: FormGroup;
  isModalOpen: boolean = false;
  instrumentId!: number;
  modoInsertar: boolean = true;
  selectedImageFile: File | null = null;
  imageUrl: string | null = null; // Variable para almacenar la URL de la imagen actual
  areas: Area[] = []; // Arreglo para almacenar las áreas

  constructor(
    private formBuilder: FormBuilder,
    private instrumentService: InstrumentService,
    private areaService: AreaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadForm();
    this.cargarAreas();
  }

  // Método para cargar las áreas en el combobox
  cargarAreas() {
    const businessId = localStorage.getItem('business_id');
    if (businessId) {
      this.areaService.getAreasByBusinessId(Number(businessId)).subscribe({
        next: (data: Area[]) => {
          this.areas = data;
        },
        error: (err) => {
          console.error('Error cargando áreas:', err);
        },
      });
    } else {
      console.error('No se encontró business_id en localStorage.');
    }
  }

  loadForm() {
    this.addEditForm = this.formBuilder.group({
      areaId: ['', [Validators.required]], // Campo para el área
      model: ['', [Validators.required]],
      serial: [''],
      tolerance: [''],
      workRange: [''],
      lastCalibrationCertificate: [''],
      lastCalibrationDate: [''],
      alert: ['', [Validators.required]], // Campo de alerta
      status: ['', [Validators.required]], // Campo de estado
      image: [null],
    });
  
    this.instrumentId = this.activatedRoute.snapshot.params['id'];
    if (this.instrumentId && this.instrumentId != 0) {
      this.modoInsertar = false;
      this.instrumentService.getInstrumentById(this.instrumentId).subscribe({
        next: (response) => {
          const data: Instrument = response.data;
  
          // Convertir las fechas a formato ISO si existen
          if (data.lastCalibrationDate) {
            data.lastCalibrationDate = new Date(data.lastCalibrationDate)
              .toISOString()
              .split('T')[0];
          }
          // if (data.nextCalibrationDate) {
          //   data.nextCalibrationDate = new Date(data.nextCalibrationDate)
          //     .toISOString()
          //     .split('T')[0];
          // }
  
          // Rellenar el formulario con los datos obtenidos, incluyendo los campos de selección
          this.addEditForm.patchValue({
            ...data,
            alert: data.alert || '', // Establece el valor predeterminado del campo "Alerta"
            status: data.status || '' // Establece el valor predeterminado del campo "Estado"
          });
  
          // Asignar la URL de la imagen
          this.imageUrl = data.image ? data.image : null;
  
        },
        error: (err) => {
          console.log('Error cargando los datos del instrumento:', err);
        },
      });
    } else {
      this.modoInsertar = true;
    }
  }
  

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImageFile = target.files[0];
      this.imageUrl = URL.createObjectURL(this.selectedImageFile); // Previsualizar la imagen seleccionada
    }
  }

  // Función para abrir el modal
  openImageModal() {
    this.isModalOpen = true;
  }

  // Función para cerrar el modal
  closeImageModal() {
    this.isModalOpen = false;
  }

  saveInstrument() {
    const instrument: Instrument = this.addEditForm.value;
    const areaId = this.addEditForm.get('areaId')?.value; // Obtén el areaId del formulario
  
    if (this.modoInsertar) {
      const imageFile = this.selectedImageFile
        ? this.selectedImageFile
        : undefined;
      this.instrumentService.createInstrument(instrument, areaId, imageFile).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => console.log('Error al guardar instrumento:', err),
      });
    } else {
      const imageFile = this.selectedImageFile
        ? this.selectedImageFile
        : undefined;
      this.instrumentService
        .updateInstrument(this.instrumentId, instrument, areaId, imageFile)
        .subscribe({
          next: () => this.router.navigate(['/home']),
          error: (err) => console.log('Error al actualizar instrumento:', err),
        });
    }
  }
  

  cancel() {
    this.router.navigate(['/home']);
  }
}
