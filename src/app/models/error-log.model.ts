export interface ErrorLog {
  id: number;
  machineId: number;
  operation: 'UPALI' | 'UGASI' | 'RESTARTUJ';
  message: string;
  date: Date;
  createdBy: number;   // korisnik čija je mašina / koji je zakazao
}
