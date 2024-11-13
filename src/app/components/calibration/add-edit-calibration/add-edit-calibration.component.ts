import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CalibrationService } from '../../../services/calibration.service';
import { InstrumentService } from '../../../services/instrument.service';
import { Calibration } from '../../../models/calibration';
import { Instrument } from '../../../models/instruments';

@Component({
  selector: 'app-add-edit-calibration',
  templateUrl: './add-edit-calibration.component.html',
  styleUrls: ['./add-edit-calibration.component.css'],
})
export class AddEditCalibrationComponent implements OnInit {
  addEditForm!: FormGroup;
  calibrationId!: number;
  modoInsertar: boolean = true;
  instruments: Instrument[] = []; // Lista de instrumentos para el combobox

  constructor(
    private formBuilder: FormBuilder,
    private calibrationService: CalibrationService,
    private instrumentService: InstrumentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadForm();
    this.loadInstruments();
    this.loadCalibrationDataIfEditMode();
  }

  loadForm() {
    this.addEditForm = this.formBuilder.group({
      instrumentId: ['', [Validators.required]],
      serie: [{ value: '', disabled: true }], // Campo de serie no editable
      magnitud: ['', [Validators.required]],
      valores: ['', [Validators.required]],
      errores12022: ['', [Validators.required]],
      errores22023: ['', [Validators.required]],
      emp: ['', [Validators.required]],
      e2MinusE1: [{ value: '', disabled: true }],
      deriva: [{ value: '', disabled: true }],
      icLessThan: [{ value: '', disabled: true }],
      anios: [{ value: '', disabled: true }],
    });

    // Escucha cambios en los valores de errores y calcula automáticamente los valores dependientes
    this.addEditForm
      .get('errores12022')
      ?.valueChanges.subscribe(() => this.calculateValues());
    this.addEditForm
      .get('errores22023')
      ?.valueChanges.subscribe(() => this.calculateValues());
    this.addEditForm
      .get('emp')
      ?.valueChanges.subscribe(() => this.calculateValues());
  }

  loadInstruments() {
    const businessId = localStorage.getItem('business_id');
    if (businessId) {
      this.instrumentService
        .getInstrumentsByBusinessId(Number(businessId))
        .subscribe({
          next: (data: Instrument[]) => {
            this.instruments = data;
          },
          error: (err) => {
            console.error('Error cargando instrumentos:', err);
          },
        });
    } else {
      console.error('No se encontró business_id en localStorage.');
    }
  }

  onInstrumentSelect() {
    const selectedInstrumentId = this.addEditForm.get('instrumentId')?.value;
    const selectedInstrument = this.instruments.find(
      (instrument) => instrument.instrumentId === +selectedInstrumentId
    );
    if (selectedInstrument) {
      this.addEditForm.patchValue({
        serie: selectedInstrument.serial, // Rellena automáticamente la serie
      });
    }
  }

  calculateValues() {
    const error1 = this.addEditForm.get('errores12022')?.value || 0;
    const error2 = this.addEditForm.get('errores22023')?.value || 0;
    const emp = this.addEditForm.get('emp')?.value || 0;

    const e2MinusE1 = error2 - error1;
    const deriva = e2MinusE1 / 12;

    // Cálculo de icLessThan
    const icLessThan = deriva !== 0 ? emp / deriva : null;

    // Cálculo de anios
    const anios = icLessThan !== null ? icLessThan / 12 : null;

    this.addEditForm.patchValue({
      e2MinusE1,
      deriva,
      icLessThan,
      anios,
    });
  }

  loadCalibrationDataIfEditMode() {
    this.calibrationId = +this.activatedRoute.snapshot.params['id'];
    if (this.calibrationId && this.calibrationId !== 0) {
      this.modoInsertar = false;
      this.calibrationService.getCalibrationById(this.calibrationId).subscribe({
        next: (response: Calibration) => {
          if (response) {
            this.addEditForm.patchValue(response);
            // Llama a onInstrumentSelect después de asignar los valores
            setTimeout(() => this.onInstrumentSelect(), 0);
          } else {
            console.warn('Calibración no encontrada');
          }
        },
        error: (err) => {
          console.error('Error cargando los datos de calibración:', err);
        },
      });
    }
  }

  saveCalibration() {
    const calibration: Calibration = this.addEditForm.value;
    if (this.modoInsertar) {
      this.calibrationService.createCalibration(calibration).subscribe({
        next: () => this.router.navigate(['/calibration']),
        error: (err) => console.error('Error al guardar calibración:', err),
      });
    } else {
      this.calibrationService
        .updateCalibration(this.calibrationId, calibration)
        .subscribe({
          next: () => this.router.navigate(['/calibration']),
          error: (err) =>
            console.error('Error al actualizar calibración:', err),
        });
    }
  }

  cancel() {
    this.router.navigate(['/calibration']);
  }
}
