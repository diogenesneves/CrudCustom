import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError} from "rxjs";
import { map, catchError, flatMap} from "rxjs/operators"

import { Pendency } from "./pendency.model";

@Injectable({
  providedIn: 'root'
})
export class PendencyService {

  private apiPath: string = "http://sis.sandrapelincer.com.br/api/"

  constructor(private http: HttpClient) { }

  getAll(): Observable<Pendency[]>{
    return this.http.get(`${this.apiPath}${'customOrders/index.json'}`).pipe(
      catchError(this.handleError),
      map(res => {
        return res.data;
      }))
  }

  getById(id: number): Observable<Pendency>{
    const url = `${this.apiPath}/${id}`;
      return this.http.get(url).pipe(
        catchError(this.handleError),
        map(this.jsonDataToPendency)
      )
  }

  create(pendency: Pendency): Observable<Pendency>{
    return this.http.post(this.apiPath, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
    )
  }

  update(pendency: Pendency): Observable<Pendency>{
    const url = `${this.apiPath}/${pendency.id}`;
     return this.http.put(url, pendency).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPendency)
     )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
      return this.http.delete(url).pipe(
        catchError(this.handleError),
        map(() => console.log("EXCLUÍDO COM SUCESSO!"))
      )
  }

//  PRIVATE METHODS

private jsonDataToPendencies(jsonData: any[]): Pendency[] {
  const pendencies: Pendency[] = []
  jsonData.forEach(element => pendencies.push( element as Pendency));
    return pendencies;
}

private jsonDataToPendency(jsonData: any): Pendency{
  return jsonData as Pendency;
}

private handleError(error: any): Observable<any>{
  console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
}

}
