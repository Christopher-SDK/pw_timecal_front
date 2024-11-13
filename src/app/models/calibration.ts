export interface Calibration {
    calibrationId: number;
    serie: string;
    magnitud: string;
    valores: number;
    errores12022: number;
    errores22023: number;
    emp: number;
    instrumentId: number; // ID del Instrument al que pertenece

    // Valores calculados
    e2MinusE1: number;
    deriva: number;
    icLessThan: number;
    anios: number;
}
