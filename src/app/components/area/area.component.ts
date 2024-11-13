import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AreaService } from '../../services/area.service';
import { BusinessService } from '../../services/business.service';
import { Area } from '../../models/area';
import { Router } from '@angular/router';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
})
export class AreaComponent implements OnInit {
  dsAreas: Area[] = [];
  displayedAreas: { area: Area; businessName: string }[] = [];
  displayedColumns: string[] = ['areaId', 'name', 'businessName', 'actions'];
  isAdmin: boolean = false; // Nueva propiedad para verificar si el usuario es admin

  constructor(
    private areaService: AreaService,
    private businessService: BusinessService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.cargarAreas();
  }

  cargarAreas(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const businessId = localStorage.getItem('business_id');
      if (businessId) {
        this.areaService.getAreasByBusinessId(Number(businessId)).subscribe({
          next: (areas: Area[]) => {
            this.dsAreas = areas;
            this.cargarBusinessNames(); // Cargar los nombres de negocios para cada área
          },
          error: (err) => {
            console.error('Error cargando áreas:', err);
          },
        });
      } else {
        console.error('No se encontró business_id en localStorage.');
      }
    }
  }

  // Función para verificar el rol del usuario
  checkUserRole() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userRole = localStorage.getItem('user_type');
      this.isAdmin = userRole === 'ROLE_ADMIN';
    }
  }

  cargarBusinessNames() {
    // Para cada área, obtenemos el nombre del negocio asociado usando el businessId
    const areasWithBusinessNames = this.dsAreas.map(async (area) => {
      const business = await this.businessService
        .getBusinessById(area.businessId)
        .toPromise();
      return { area, businessName: business ? business.name : 'N/A' };
    });

    // Espera a que todos los nombres de negocios se carguen antes de asignarlos a displayedAreas
    Promise.all(areasWithBusinessNames).then((areas) => {
      this.displayedAreas = areas;
    });
  }

  filterAreas(event: Event) {
    const filterText = (event.target as HTMLInputElement).value.toLowerCase();
    this.displayedAreas = this.dsAreas
      .map((area) => {
        const businessName =
          this.displayedAreas.find((a) => a.area.areaId === area.areaId)
            ?.businessName || 'N/A';
        return { area, businessName };
      })
      .filter(
        ({ area, businessName }) =>
          area.name.toLowerCase().includes(filterText) ||
          businessName.toLowerCase().includes(filterText)
      );
  }

  editArea(area: Area) {
    // Redirige a la página de edición de área
    this.router.navigate([`area/edit-area/${area.areaId}`]);
  }

  deleteArea(areaId: number) {
    // Confirmación antes de eliminar el área
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
        this.areaService.deleteArea(areaId).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El área ha sido eliminada.', 'success');
            this.cargarAreas(); // Recargar las áreas después de eliminar
          },
          error: (err) => {
            console.error('Error al eliminar el área:', err);
            Swal.fire('Error', 'Hubo un problema al eliminar el área', 'error');
          },
        });
      }
    });
  }
}
