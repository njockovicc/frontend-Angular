import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MachinesService } from '../../services/machines.service';
import { MachineSchedule } from '../../models/machine.model';

@Component({
  selector: 'app-machines-schedule',
  templateUrl: './machines-schedule.component.html',
})
export class MachinesScheduleComponent implements OnInit {
  scheduleForm!: FormGroup;
  machineId: string | null = null;
  actions: string[] = ['UPALI', 'UGASI', 'RESTARTUJ'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private machineService: MachinesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.machineId = this.route.snapshot.paramMap.get('id');

    this.scheduleForm = this.fb.group({
      action: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  scheduleAction(): void {
    if (this.scheduleForm.valid && this.machineId) {
      const formValue = this.scheduleForm.value;
      const schedule: MachineSchedule = {
        date: formValue.date,
        time: formValue.time,
        operation: formValue.action,
      };
      this.machineService
        .scheduleMachine(this.machineId, schedule)
        .subscribe(() => {
          this.router.navigate(['/machines']);
        });
    }
  }
}
