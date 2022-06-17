import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TaskComponent } from './task/task.component';
import { TaskComponentDialog } from './dialog/task/task.component.dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    TaskComponent,
    TaskComponentDialog
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  providers:[
    TaskComponentDialog,
    MatDatepickerModule, 
    MatNativeDateModule,
  ]
})
export class TasksModule { }