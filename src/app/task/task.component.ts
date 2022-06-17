import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../services/web-api.service';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { TaskComponentDialog } from '../dialog/task/task.component.dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HandleAppService } from '../services/handle-app.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  loading:boolean = false;
  tasks:any = [];

  constructor(
    private webApiService:WebApiService,
    public dialog: MatDialog,
    public handler:HandleAppService
  ){ }

  ngOnInit(): void {
    this.loading = true;
    this.sendRequest();
  }

  sendRequest(){
    this.loading = true;
    this.webApiService.getRequest("/tasks",{})
    .pipe(finalize(()=>this.loading = false))
    .subscribe(
      data=>{
        data.map((item:any)=>{
          let date = moment(item.execution);
          item.execution = date.format('DD-MM-YYYY hh:mm a')
          item.late = this.verifyDiffDateTime(date);
        });
        this.tasks = data;
      },
      error=>{
        this.handler.showError()
      }
    );
  }

  verifyDiffDateTime(dateTime:moment.Moment){
    let late = moment(new Date());
    if(late.diff(dateTime,'days') <= 0){
      if(late.diff(dateTime,'days') == 0){
        if(late.diff(dateTime,'hours')<0){
          return '0 días';
        }
        return late.diff(dateTime,'hours')+' horas';
      }
      return '0 días';
    }
    return late.diff(dateTime,'days') + ' días';
  }

  openDialog(option:string,id:number|null){
    this.loading = true;
    const dialogRef = this.dialog.open(TaskComponentDialog,{
      data:{
        view: option,
        id
      }
    })
    dialogRef.disableClose = true;
    dialogRef.componentInstance.loading.subscribe(val=>{
      this.loading = val;
    })
    dialogRef.componentInstance.reload.subscribe(()=>{
      this.sendRequest();
    })
  }

  delete(id:number){
    this.handler.showQuestion("Esta seguro de eliminar la tarea?")
    .then((result) => {
      if (result.isConfirmed) {
        this.webApiService.deleteRequest('/tasks/delete/'+id,{},{})
        .subscribe(
          data=>{
            this.handler.showMixin("Eliminado correctamente");
            this.sendRequest();
          },
          error=>{
            this.handler.showError();
          }
        );
      }
    });
  }

  checkTask(id:number){
    this.loading = true;
    this.webApiService.putRequest("/tasks/complete/"+id,{},{})
    .pipe(finalize(()=>this.loading = false))
    .subscribe(
      data=>{
        this.handler.showMixin("Tarea Completada!");
        this.sendRequest();
      },
      error=>{
        this.handler.showError();
      }
    )
  }

}
