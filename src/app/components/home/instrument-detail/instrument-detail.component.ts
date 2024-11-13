import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstrumentService } from '../../../services/instrument.service';
import { CalibrationService } from '../../../services/calibration.service';
import { Instrument } from '../../../models/instruments';
import { Calibration } from '../../../models/calibration';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css'],
})
export class InstrumentDetailComponent implements OnInit {
  instrument: Instrument | null = null;
  calibrations: Calibration[] = [];
  selectedImageFile: File | null = null;
  imageUrl: string | null = null; // Variable para almacenar la URL de la imagen actual


  // Declaración de lineChartData
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Errores 2022',
        borderColor: '#4caf50',
        fill: false,
      },
      {
        data: [],
        label: 'Errores 2023',
        borderColor: '#f44336',
        fill: false,
      },
    ],
  };

  // Opciones para el gráfico
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  constructor(
    private route: ActivatedRoute,
    private instrumentService: InstrumentService,
    private calibrationService: CalibrationService
  ) {}

  ngOnInit(): void {
    const instrumentId = +this.route.snapshot.params['id'];
    this.loadInstrumentData(instrumentId);
    this.loadCalibrationData(instrumentId);
  }

  loadInstrumentData(instrumentId: number): void {
    this.instrumentService.getInstrumentById(instrumentId).subscribe({
      next: (response: { data: Instrument }) => {
        this.instrument = response.data;

        // Asignar la URL de la imagen si está disponible
        this.imageUrl = this.instrument?.image || null;
      },
      error: (err) => {
        console.error('Error loading instrument:', err);
      },
    });
  }


  loadCalibrationData(instrumentId: number): void {
    this.calibrationService
      .getCalibrationsByInstrumentId(instrumentId)
      .subscribe({
        next: (data: Calibration[]) => {
          this.calibrations = data;
          this.populateChartData();
        },
        error: (err) => {
          console.error('Error loading calibrations:', err);
        },
      });
  }

  populateChartData(): void {
    // Ordena las calibraciones de menor a mayor según el campo e2MinusE1
    const sortedCalibrations = this.calibrations.sort(
      (a, b) => a.e2MinusE1 - b.e2MinusE1
    );

    // Pobla los datos en el gráfico después de ordenar
    this.lineChartData.labels = sortedCalibrations.map(
      (calibration) => calibration.serie
    );
    this.lineChartData.datasets[0].data = sortedCalibrations.map(
      (calibration) => calibration.errores12022
    );
    this.lineChartData.datasets[1].data = sortedCalibrations.map(
      (calibration) => calibration.errores22023
    );
  }

  isModalOpen: boolean = false;

  openImageModal() {
    this.isModalOpen = true;
  }


  closeImageModal() {
    this.isModalOpen = false;
  }
}
