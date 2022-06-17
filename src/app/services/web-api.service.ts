import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from "./../data-config";

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  urlFrontend:string = config.urlFrontend;
  urlBackend:string = config.urlBackend;

  constructor(private _http:HttpClient) { }

  getRequest(url:string, params:any):Observable<any>{
    let querySting = this.processParams(params);
    let headers = this.setHeaders();
    url = this.urlBackend + url;
    return this._http.get<any>(url,{headers,params:querySting})
  }

  postRequest(url:string,body:any,params:any):Observable<any>{
    let headers = this.setHeaders();
    body = JSON.stringify(body);
    url = this.urlBackend+url;
    return this._http.post<any>(url,body,{headers,params});
  }

  putRequest(url:string,body:any,params:any):Observable<any>{
    let headers = this.setHeaders();
    body = JSON.stringify(body);
    url = this.urlBackend+url;
    return this._http.put<any>(url,body,{headers,params});
  }

  deleteRequest(url:string,body:any,params:any){
    let headers = this.setHeaders();
    params = Object.assign(body,params);
    params = this.processParams(params);
    url = this.urlBackend+url;
    return this._http.delete(url,{headers,params});
  }

  setHeaders(){
    let headers = new HttpHeaders()
    .append('Content-Type','application/json');
    return headers;
  }

  processParams(params:any){
    let queryParams:any = {};
    for(var key in params){
      if(params[key] != undefined && params[key] !=null){
        queryParams[key] = params[key];
      }
    }
    return new HttpParams({fromObject:queryParams});
  }
}
