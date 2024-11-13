import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { BusinessComponent } from './components/business/business.component';
import { AreaComponent } from './components/area/area.component';
import { AddEditBusinessComponent } from './components/business/add-edit-business/add-edit-business.component';
import { AddEditAreaComponent } from './components/area/add-edit-area/add-edit-area.component';
import { CalibrationComponent } from './components/calibration/calibration.component';
import { AddEditCalibrationComponent } from './components/calibration/add-edit-calibration/add-edit-calibration.component';
import { ReportCalibradosComponent } from './components/home/report-calibrados/report-calibrados.component';
import { InstrumentDetailComponent } from './components/home/instrument-detail/instrument-detail.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'area', component: AreaComponent },
  { path: 'calibration', component: CalibrationComponent },
  { path: 'new-instrument', component: AddEditComponent },
  { path: 'edit-instrument/:id', component: AddEditComponent },
  { path: 'business/add-business', component: AddEditBusinessComponent },
  { path: 'business/edit-business/:id', component: AddEditBusinessComponent },
  { path: 'area/add-area', component: AddEditAreaComponent },
  { path: 'area/edit-area/:id', component: AddEditAreaComponent },
  {
    path: 'calibration/add-calibration',
    component: AddEditCalibrationComponent,
  },
  {
    path: 'calibration/edit-calibration/:id',
    component: AddEditCalibrationComponent,
  },

  { path: 'home/report-calibrados', component: ReportCalibradosComponent },
  { path: 'instrument-detail/:id', component: InstrumentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
