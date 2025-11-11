export type MachineState = 'UPALJENA' | 'UGASENA';

export interface Machine {
  id: number;          // JI
  name: string;        // Ime
  type: string;        // Tip
  description?: string;
  state: MachineState; // stanje
  createdBy: number;   // id korisnika koji je napravio
  active: boolean;     // mekano brisanje
  createdAt: Date;
}
