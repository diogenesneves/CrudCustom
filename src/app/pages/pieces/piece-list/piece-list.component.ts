import { Component, OnInit } from '@angular/core';
import { PieceService } from '../shared/piece.service';
import { Piece } from '../shared/piece.model';

@Component({
  selector: 'app-piece-list',
  templateUrl: './piece-list.component.html',
  styleUrls: ['./piece-list.component.css']
})
export class PieceListComponent implements OnInit {

  pendencies: Piece[] = [];
  nome="";

  constructor(private pieceService: PieceService) { }

  ngOnInit() {
    this.pieceService.getAll().subscribe(
      pendencies => this.pendencies = pendencies.sort((a,b)=> a.id - b.id),
      error => alert('Erro ao carregar a lista')
    )
  }

  deletePendency(pendency) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.pieceService.delete(pendency.id).subscribe(
        () => this.pendencies = this.pendencies.filter(element => element != pendency),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }
}
