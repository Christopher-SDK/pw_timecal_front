import Swal from 'sweetalert2';
import { InstrumentService } from './../../services/instrument.service';
import { Component, OnInit } from '@angular/core';
import { Instrument } from '../../models/instruments';
import { AreaService } from '../../services/area.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  dsInstruments: Instrument[] = [];
  displayedInstruments: { instrument: Instrument; areaName: string }[] = [];
  paginatedInstruments: { instrument: Instrument; areaName: string }[] = [];
  displayedColumns: string[] = [
    'areaName',
    'instrumentId',
    'model',
    'serial',
    'lastCalibrationDate',
    'nextCalibrationDate',
    'status',
    'alert',
    'imageUrl',
    'actions',
  ];

  expiringPercentage: number = 0;
  isAdmin: boolean = false;

  currentPage: number = 0;
  pageSize: number = 5;

  isModalVisible: boolean = false;
  selectedImageUrl: string | null = null;

  constructor(
    private instrumentService: InstrumentService,
    private areaService: AreaService
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.cargarInstrumentos();
  }

  // Función para verificar el rol del usuario
  checkUserRole() {
    if (typeof window !== 'undefined') {
      // Solo ejecuta en el entorno del navegador
      const userRole = localStorage.getItem('user_type');
      this.isAdmin = userRole === 'ROLE_ADMIN';
    } else {
      console.warn('No se puede acceder a localStorage fuera del entorno del navegador');
    }
  }

  showImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.isModalVisible = true;
  }

  closeImageModal() {
    this.isModalVisible = false;
    this.selectedImageUrl = null;
  }

  cargarInstrumentos(): void {
    if (typeof window !== 'undefined') {
      // Solo ejecuta en el entorno del navegador
      const businessId = localStorage.getItem('business_id');

      if (businessId) {
        this.instrumentService.getInstrumentsByBusinessId(+businessId).subscribe({
          next: async (data: Instrument[]) => {
            const instrumentsWithAreaNames = await Promise.all(
              data.map(async (instrument) => {
                const area = await this.areaService.getAreaById(instrument.areaId).toPromise();
                const areaName = area ? area.name : 'N/A';
                instrument.imageUrl = instrument.image ? `${instrument.image}` : '';
                return { instrument, areaName };
              })
            );
            this.displayedInstruments = instrumentsWithAreaNames;
            this.setPageData();
            this.processExpiringCalibrationData();
          },
          error: (err) => {
            console.error('Error cargando instrumentos:', err);
          },
        });
      } else {
        console.error("No se encontró 'business_id' en el localStorage");
      }
    } else {
      console.warn('No se puede acceder a localStorage fuera del entorno del navegador');
    }
  }

  processExpiringCalibrationData() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const expiringSoon = this.displayedInstruments.filter(({ instrument }) => {
      const nextCalibrationDate = new Date(instrument.nextCalibrationDate);
      return nextCalibrationDate >= now && nextCalibrationDate <= nextMonth;
    }).length;

    this.expiringPercentage = parseFloat(((expiringSoon / this.displayedInstruments.length) * 100).toFixed(2));
  }

  setPageData() {
    this.paginatedInstruments = this.displayedInstruments.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.setPageData();
    }
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.displayedInstruments.length) {
      this.currentPage++;
      this.setPageData();
    }
  }

  get hasPrevPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.displayedInstruments.length;
  }

  filterInstruments(event: Event) {
    const filtro = (event.target as HTMLInputElement).value.toLowerCase();
    this.paginatedInstruments = this.displayedInstruments
      .filter(({ instrument, areaName }) =>
        instrument.model.toLowerCase().includes(filtro) ||
        instrument.serial.toLowerCase().includes(filtro) ||
        areaName.toLowerCase().includes(filtro)
      )
      .slice(
        this.currentPage * this.pageSize,
        (this.currentPage + 1) * this.pageSize
      );
  }

  deleteInstrument(id: number) {
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
        this.instrumentService.deleteInstrument(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El instrumento ha sido eliminado.', 'success');
            this.cargarInstrumentos();
          },
          error: (err) => {
            console.log(err);
            Swal.fire('Error', 'Hubo un problema al eliminar el instrumento', 'error');
          },
        });
      }
    });
  }
}
