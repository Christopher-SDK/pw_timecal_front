import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CalibrationService } from '../../services/calibration.service';
import { Calibration } from '../../models/calibration';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.css'],
})
export class CalibrationComponent implements OnInit {
  dsCalibrations: Calibration[] = [];
  displayedCalibrations: Calibration[] = [];
  isAdmin: boolean = false; // Nueva propiedad para verificar si el usuario es admin

  constructor(
    private calibrationService: CalibrationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadCalibrations();
  }

  // Función para verificar el rol del usuario
  checkUserRole() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userRole = localStorage.getItem('user_type');
      this.isAdmin = userRole === 'ROLE_ADMIN';
    } else {
      console.warn('No se puede acceder a localStorage fuera del entorno del navegador');
    }
  }

  loadCalibrations(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const businessId = localStorage.getItem('business_id');
      if (businessId) {
        this.calibrationService
          .getCalibrationsByBusinessId(Number(businessId))
          .subscribe({
            next: (calibrations: Calibration[]) => {
              this.dsCalibrations = calibrations;
              this.displayedCalibrations = calibrations;
            },
            error: (err) => {
              console.error('Error cargando calibraciones:', err);
            },
          });
      } else {
        console.error('No se encontró business_id en localStorage.');
      }
    } else {
      console.warn('No se puede acceder a localStorage fuera del entorno del navegador');
    }
  }

  filterCalibrations(event: Event) {
    const filterText = (event.target as HTMLInputElement).value.toLowerCase();
    this.displayedCalibrations = this.dsCalibrations.filter(
      (calibration) =>
        calibration.serie.toLowerCase().includes(filterText) ||
        calibration.magnitud.toLowerCase().includes(filterText) ||
        calibration.valores.toString().includes(filterText)
    );
  }

  editCalibration(calibration: Calibration) {
    // Navegar a la página de edición de calibración
    this.router.navigate([
      `calibration/edit-calibration/${calibration.calibrationId}`,
    ]);
  }

  deleteCalibration(calibrationId: number) {
    // Confirmación antes de eliminar la calibración
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.calibrationService.deleteCalibration(calibrationId).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'La calibración ha sido eliminada.',
              'success'
            );
            this.loadCalibrations(); // Recargar calibraciones después de eliminar
          },
          error: (err) => {
            console.error('Error al eliminar la calibración:', err);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la calibración',
              'error'
            );
          },
        });
      }
    });
  }
}
