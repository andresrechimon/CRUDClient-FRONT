import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientserviceService {
  private myAppUrl = "https://localhost:5001/";
  private myApiUrl = "api/clients/";

  constructor(private http: HttpClient) {}

  getListClients(): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrl);
  }

  deleteClient(id: number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl + id)
  }

  saveClient(client: any): Observable<any>{
    return this.http.post(this.myAppUrl + this.myApiUrl, client);
  }

  updateClient(id:number, client:any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl + id, client);
  }
}
