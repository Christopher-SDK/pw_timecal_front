export interface Instrument {
    instrumentId: number;
    model: string;
    serial: string;
    tolerance: string;
    workRange: string;
    lastCalibrationCertificate: string;
    lastCalibrationDate: string;  // Usamos string para las fechas para facilitar el manejo en JavaScript
    nextCalibrationMonths: number;
    nextCalibrationDate: string;
    alert: string;
    status: string;
    image: string; // byte[] en Java corresponde a Uint8Array en TypeScript
    imageUrl?: string;  // Nueva propiedad para almacenar la imagen en formato Base64
    areaId: number;  // Referencia al ID del Área
}
