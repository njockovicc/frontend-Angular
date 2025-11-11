import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Machine, MachineState } from '../../../models/machine.model';
import { MachineService } from '../../../services/machine.service';
import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-machines-search',
  templateUrl: './machines-search.component.html'
})
export class MachinesSearchComponent implements OnInit {

  machines: Machine[] = [];

  // filter polja
  name = '';
  selectedStates: MachineState[] = [];
  startDate = '';
  endDate = '';

  // za prikaz poruke "nemaš dozvolu"
  noPermission = false;

  allStates: MachineState[] = ['UPALJENA', 'UGASENA'];

  constructor(
    private machineService: MachineService,
    private permission: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. mora da bude ulogovan
    if (!this.permission.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. mora da ima dozvolu za pretragu mašina
    if (!this.permission.canSearchMachines()) {
      this.noPermission = true;
      return;
    }

    // 3. učitaj mašine koje sme da vidi
    this.loadMachines();
  }

  // učitava mašine koje user sme da vidi i odmah primeni filtere
  private loadMachines(): void {
    const userId = this.permission.getCurrentUserId();
    const isAdmin = this.permission.isAdmin();

    // prvo uzmi mašine koje uopšte sme da vidi
    const visible = this.machineService.getAllFor(userId!, isAdmin);

    // pa onda primeni filtere iz forme
    this.machines = this.applyFilters(visible);
  }

  // klik na "Traži"
  search(): void {
    this.loadMachines();
  }

  // pomoćna - primeni sva 4 filtera na prosleđenu listu
  private applyFilters(list: Machine[]): Machine[] {
    let result = [...list];

    if (this.name.trim() !== '') {
      const lower = this.name.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(lower));
    }

    if (this.selectedStates.length > 0) {
      result = result.filter(m => this.selectedStates.includes(m.state));
    }

    if (this.startDate) {
      const start = new Date(this.startDate);
      result = result.filter(m => m.createdAt >= start);
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(m => m.createdAt <= end);
    }

    return result;
  }

  // checkbox za stanje
  toggleState(state: MachineState): void {
    if (this.selectedStates.includes(state)) {
      this.selectedStates = this.selectedStates.filter(s => s !== state);
    } else {
      this.selectedStates.push(state);
    }
  }

  // brisanje mašine
  delete(id: number): void {
    this.machineService.destroy(id);
    this.loadMachines();
  }
}
