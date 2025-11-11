import { Injectable } from '@angular/core';
import { Machine, MachineState } from '../models/machine.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  // glumi bazu
  private machines: Machine[] = [
    {
      id: 1,
      name: 'Masina admina',
      type: 'server',
      description: 'serverska masina',
      state: 'UGASENA',
      createdBy: 1,
      active: true,
      createdAt: new Date('2025-11-01')
    },
    {
      id: 2,
      name: 'Masina zike',
      type: 'baza',
      description: 'baza podataka',
      state: 'UPALJENA',
      createdBy: 3,
      active: true,
      createdAt: new Date('2025-11-05')
    },
    {
      id: 3,
      name: 'Masina druga zike',
      type: 'test',
      description: 'test masina',
      state: 'UGASENA',
      createdBy: 3,
      active: true,
      createdAt: new Date('2025-11-07')
    }
  ];

  // vrati sve aktivne
  private getAllActive(): Machine[] {
    return this.machines.filter(m => m.active);
  }

  // OVO je nova metoda koja rešava "admin vidi sve / ostali svoje"
  getAllFor(userId: number, isAdmin: boolean): Machine[] {
    const all = this.getAllActive();
    if (isAdmin) {
      return all;
    }
    return all.filter(m => m.createdBy === userId);
  }

  // search sada PRIMA I LISTU NAD KOJOM TRAŽI
  search(
    filter: {
      name?: string;
      states?: MachineState[];
      startDate?: string;
      endDate?: string;
    },
    source: Machine[]
  ): Machine[] {

    let result = [...source];

    if (filter.name && filter.name.trim() !== '') {
      const lower = filter.name.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(lower));
    }

    if (filter.states && filter.states.length > 0) {
      result = result.filter(m => filter.states!.includes(m.state));
    }

    if (filter.startDate) {
      const start = new Date(filter.startDate);
      result = result.filter(m => m.createdAt >= start);
    }

    if (filter.endDate) {
      const end = new Date(filter.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(m => m.createdAt <= end);
    }

    return result;
  }

  private getNextId(): number {
    if (this.machines.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.machines.map(m => m.id));
    return maxId + 1;
  }

  create(machine: { name: string; type: string; description?: string; createdBy: number }): void {
    const newId = this.getNextId();
    this.machines.push({
      id: newId,
      name: machine.name,
      type: machine.type,
      description: machine.description,
      state: 'UGASENA',
      createdBy: machine.createdBy,
      active: true,
      createdAt: new Date()
    });
  }

  destroy(id: number): void {
    const m = this.machines.find(x => x.id === id);
    if (m) {
      m.active = false;
    }
  }
}
