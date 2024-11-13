import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import Swal from 'sweetalert2';
import { UserService } from './services/user.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { AreaComponent } from './components/area/area.component';
import { BusinessComponent } from './components/business/business.component';
import { AddEditBusinessComponent } from './components/business/add-edit-business/add-edit-business.component';
import { AddEditAreaComponent } from './components/area/add-edit-area/add-edit-area.component';
import { CalibrationComponent } from './components/calibration/calibration.component';
import { AddEditCalibrationComponent } from './components/calibration/add-edit-calibration/add-edit-calibration.component';
import { ReportCalibradosComponent } from './components/home/report-calibrados/report-calibrados.component'; // <--- Asegúrate de importar RouterModule
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { InstrumentDetailComponent } from './components/home/instrument-detail/instrument-detail.component';

Chart.register(...registerables); // Esto es importante para que se registren los componentes necesarios de Chart.js



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddEditComponent,
    AreaComponent,
    BusinessComponent,
    AddEditBusinessComponent,
    AddEditAreaComponent,
    CalibrationComponent,
    AddEditCalibrationComponent,
    ReportCalibradosComponent,
    InstrumentDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    BaseChartDirective
    ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi:true
    },
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
