import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core'
import { finalize } from 'rxjs';
import { HandleAppService } from 'src/app/services/handle-app.service';
import { WebApiService } from 'src/app/services/web-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-taskDialog',
  templateUrl: './task.component.dialog.html'
})
export class TaskComponentDialog implements OnInit {

  title:string  = "";
  id:number     = 0;
  employees:any = [];
  view:string   = "";
  task:any      = {};
  status:any    = [
    {id:'Pendiente',name:"Pendiente"},
    {id:'Completada',name:"Completada"},
    {id:'Cancelada',name:"Cancelada"}
  ];

  formTask:FormGroup = new FormGroup({});

  @Output() loading    = new EventEmitter();
  @Output() reload     = new EventEmitter();

  constructor(
    public webApiService:WebApiService,
    public handler:HandleAppService,
    public dialogRef: MatDialogRef<TaskComponentDialog>,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this._adapter.setLocale('us');
    this.view = this.data.view;
    this.id = this.data.id;
    switch(this.data.view){
      case 'view':
        this.title = "";
        this.getData()
        .subscribe(
          data=>{
            this.task               = data;
            this.title              = '#'+this.task.id+' - '+this.task.taskName;
            let date                = moment(this.task.execution);
            this.task.execution     = date.format('DD-MM-YYYY hh:mm a');
            let createdAt           = moment(this.task.createdAt);
            this.task.createdAt     = createdAt.format('DD-MM-YYYY hh:mm a');
          },
          error=>{
            this.handler.showError();
          }
        )
      break;
      case 'create':
        this.title = "Crear tarea";
        this.initForms();
      break;
      case 'update':
        this.title = "Actualizar Tarea "+this.id;
        this.initForms();
      break;
    }
    
  }

  initForms(){
    this.getParams()
    this.formTask = new FormGroup({
      taskName:       new FormControl("",[Validators.required]),
      description:    new FormControl(""),
      employeeId:     new FormControl("",[Validators.required]),
      execution:      new FormControl("",[Validators.required]),
      status:         new FormControl("")
    }); 
  }

  getParams(){
    this.loading.emit(true);
    this.webApiService.getRequest("/employee",{})
    .pipe(finalize(()=>this.loading.emit(false)))
    .subscribe(
      data =>{
        this.employees = data;
        if(this.view == 'update'){
          this.getDataUpdate()
        }else{
          this.loading.emit(false);
        }
      },
      error=>{
        console.log(error)
        this.handler.showError("Erro al obtener empleados");
      }
    )
  }

  getData(){
    return this.webApiService.getRequest('/tasks/'+this.id,{})
    .pipe(finalize(()=>{this.loading.emit(false)}))
  }

  getDataUpdate(){
    this.getData()
    .subscribe(
      data=>{
        console.log(data);
        this.formTask.get('taskName')?.setValue(data.taskName);
        this.formTask.get('description')?.setValue(data.description);
        this.formTask.get('employeeId')?.setValue(data.employee.id);
        let date = moment(data.execution);
        this.formTask.get('execution')?.setValue(date.format('YYYY-MM-DDTHH:mm'));
        this.formTask.get('status')?.setValue(data.status)
      },
      error=>this.handler.showError()
    );
  }

  onSubmit(){
    if(this.formTask.valid){
      let body = this.formTask.value;
      this.webApiService.postRequest('/tasks',body,{})
      .subscribe(
        data=>{
          this.handler.showMixin("Tarea creada exitosamente!");
          this.reload.emit();
          this.dialogClose()
        },
        error=>console.log(error)
      )
    }else{
      this.handler.showAlert("Por favor, Complete los campos requeridos");
    }
  }
  
  onSubmitUpdate(){
    if(this.formTask.valid){
      let body = this.formTask.value;
      this.webApiService.putRequest('/tasks/'+this.id,body,{})
      .subscribe(
        data=>{
          this.handler.showMixin("Tarea actualizada exitosamente!");
          this.reload.emit();
          this.dialogClose()
        },
        error=>console.log(error)
      )
    }else{
      this.handler.showAlert("Por favor, Complete los campos requeridos");
    }
  }

  dialogClose(){
    this.dialogRef.close();
  }

}
