import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Asegúrate de importar Router
import Swal from 'sweetalert2';
import { BusinessService } from '../../services/business.service';
import { AreaService } from '../../services/area.service';
import { Business } from '../../models/business';
import { Area } from '../../models/area';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  dsBusinesses: Business[] = [];
  displayedBusinesses: { business: Business; areas: Area[] }[] = [];
  displayedColumns: string[] = ["businessId", "name", "areas", "actions"];

  // Paginación
  currentPage: number = 0;
  pageSize: number = 5;
  businessIdFromStorage!: number; // ID del negocio desde localStorage

  isAdmin: boolean = false; // Nueva propiedad para verificar si el usuario es admin

  constructor(
    private businessService: BusinessService,
    private areaService: AreaService,
    private router: Router // Añadir Router al constructor
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadBusinessIdFromStorage();
    this.cargarBusinesses();
  }

  loadBusinessIdFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const businessId = localStorage.getItem('business_id');
      if (businessId) {
        this.businessIdFromStorage = +businessId;
      }
    } else {
      console.warn('No se puede acceder a localStorage fuera del entorno del navegador');
    }
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

  cargarBusinesses(): void {
    if (this.businessIdFromStorage) {
      this.businessService.getBusinessById(this.businessIdFromStorage).subscribe({
        next: (business: Business) => {
          this.dsBusinesses = [business];
          this.cargarAreasParaBusinesses();
        },
        error: (err) => {
          console.error('Error cargando el negocio:', err);
        }
      });
    } else {
      console.error('business_id no encontrado en localStorage');
    }
  }

  cargarAreasParaBusinesses() {
    const businessesWithAreas = this.dsBusinesses.map(async (business) => {
      const areas = await this.areaService.getAreasByBusinessId(business.businessId).toPromise();
      return { business, areas: areas || [] };
    });

    Promise.all(businessesWithAreas).then(businesses => {
      this.displayedBusinesses = businesses;
      this.setPageData();
    });
  }

  filterBusinesses(event: Event) {
    const filterText = (event.target as HTMLInputElement).value.toLowerCase();
    this.displayedBusinesses = this.dsBusinesses
      .map(business => {
        const areas = this.displayedBusinesses.find(b => b.business.businessId === business.businessId)?.areas || [];
        return { business, areas };
      })
      .filter(({ business, areas }) => 
        business.name.toLowerCase().includes(filterText) ||
        areas.some(area => area.name.toLowerCase().includes(filterText))
      );
    this.setPageData();
  }

  setPageData() {
    this.displayedBusinesses = this.displayedBusinesses.slice(
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
    if ((this.currentPage + 1) * this.pageSize < this.dsBusinesses.length) {
      this.currentPage++;
      this.setPageData();
    }
  }

  get hasPrevPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.dsBusinesses.length;
  }

  // Método editBusiness para redirigir usando el Router
  editBusiness(business: Business) {
    this.router.navigate([`business/edit-business/${business.businessId}`]); // Navegar a la URL de edición
  }

  deleteBusiness(businessId: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.businessService.deleteBusiness(businessId).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El negocio ha sido eliminado.', 'success');
            this.cargarBusinesses();
          },
          error: (err) => {
            console.log(err);
            Swal.fire('Error', 'Hubo un problema al eliminar el negocio', 'error');
          }
        });
      }
    });
  }
}
