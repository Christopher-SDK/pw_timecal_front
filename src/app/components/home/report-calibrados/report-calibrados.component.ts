import { Component, OnInit } from '@angular/core';
import { InstrumentService } from '../../../services/instrument.service';
import { Instrument } from '../../../models/instruments';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-report-calibrados',
  templateUrl: './report-calibrados.component.html',
  styleUrls: ['./report-calibrados.component.css']
})
export class ReportCalibradosComponent implements OnInit {
  instruments: Instrument[] = [];
  calibratedCount: number = 0;
  notCalibratedCount: number = 0;

  pieChartData: ChartData<'pie'> = {
    labels: ['Calibrados', 'No Calibrados'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'black', // Asegúrate de que las etiquetas tengan un color
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            const total = this.calibratedCount + this.notCalibratedCount;
            const percentage = ((value as number) / total * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  constructor(private instrumentService: InstrumentService) {}

  ngOnInit(): void {
    this.loadInstrumentsData();
  }

  loadInstrumentsData() {
    // Obtiene el businessId del usuario desde el localStorage
    const businessId = localStorage.getItem('business_id');
    if (businessId) {
      this.instrumentService.getInstrumentsByBusinessId(Number(businessId)).subscribe({
        next: (data: Instrument[]) => {
          this.instruments = data;
          this.processData();
        },
        error: (err) => console.error('Error loading instruments:', err),
      });
    } else {
      console.error('No business_id found in localStorage.');
    }
  }

  processData() {
    this.calibratedCount = this.instruments.filter(i => i.status === 'Calibrado').length;
    this.notCalibratedCount = this.instruments.length - this.calibratedCount;

    this.pieChartData.datasets[0].data = [this.calibratedCount, this.notCalibratedCount];
    this.pieChartData = { ...this.pieChartData }; // Asegura que el gráfico se actualice correctamente
  }
}
