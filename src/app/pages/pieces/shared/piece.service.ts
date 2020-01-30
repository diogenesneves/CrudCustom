import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError} from "rxjs";
import { map, catchError, flatMap} from "rxjs/operators"

import { Piece } from "./piece.model";

@Injectable({
  providedIn: 'root'
})
export class PieceService {

  private apiPath: string = "http://sis.sandrapelincer.com.br/api/customPieces/"

  constructor(private http: HttpClient) { }

  getAll(): Observable<Piece[]>{
    return this.http.get(`${this.apiPath}${'index.json'}`).pipe(
      catchError(this.handleError),
      map(res => { return res.data; })
      )
  }

  getById(id: number): Observable<Piece>{
    const url = `${this.apiPath}view/${id}.json`;
      return this.http.get(url).pipe(
        catchError(this.handleError),
        map(res => { return res.data[0]; })
        )
  }

  create(piece: Piece): Observable<Piece>{
    return this.http.post(`${this.apiPath}${'add.json'}`, piece).pipe(
      catchError(this.handleError),
      //map(this.jsonDataToPiece)
    )
  }

  update(piece: Piece): Observable<Piece>{
    const url = `${this.apiPath}/${piece.id}`;
     return this.http.put(url, piece).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPiece)
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

private jsonDataToPieces(jsonData: any[]): Piece[] {
  const pieces: Piece[] = []
  jsonData.forEach(element => pieces.push( element as Piece));
    return pieces;
}

private jsonDataToPiece(jsonData: any): Piece{
  return jsonData as Piece;
}

private handleError(error: any): Observable<any>{
  console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
}

}
