import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HandleAppService {

  constructor() { }


  showError(text?:string){
    text = (text==null || text == "") ? 'Se ha producido un error!' : text;
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text
    })
  }

  showAlert(text:string){
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text
    })
  }

  showSuccess(title:string, text:string){
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    })
  }

  showMixin(text:string){
    Swal.mixin({
      toast: true,
      position: 'top-end',
      timer: 3000
    }).fire({
      icon: 'success',
      title: text
    });
  }

  showQuestion(question:string){
    return Swal.fire({
      title: question,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#1562da',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#be164a'
    });
  }

}
