import { Component } from '@angular/core';
import { MachineService } from '../../../services/machine.service';
import { Router } from '@angular/router';
import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent {

  name = '';
  type = '';
  description = '';

  constructor(
    private machineService: MachineService,
    private router: Router,
    private permission: PermissionService
  ) {}

  onSubmit(): void {
    if (!this.permission.canCreateMachine()) {
      alert('Nemaš dozvolu da praviš mašine.');
      return;
    }

    const userId = this.permission.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.name || !this.type) {
      alert('Naziv i tip su obavezni');
      return;
    }

    this.machineService.create({
      name: this.name,
      type: this.type,
      description: this.description,
      createdBy: userId
    });

    this.router.navigate(['/machines']);
  }

  cancel(): void {
    this.router.navigate(['/machines']);
  }
}
