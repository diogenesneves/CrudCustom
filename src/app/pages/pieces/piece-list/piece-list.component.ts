import { Component, OnInit } from '@angular/core';
import { PieceService } from '../shared/piece.service';
import { Piece } from '../shared/piece.model';
import { SortEvent } from 'primeng/api/sortevent';
import { Router } from '@angular/router';
import { FilterUtils } from '../shared/utils/filterutils';


@Component({
  selector: 'app-piece-list',
  templateUrl: './piece-list.component.html',
  styleUrls: ['./piece-list.component.css']
})
export class PieceListComponent implements OnInit {

  pendencies: Piece[] = [];
  nome="";
  cols: any[];

  constructor(private pieceService: PieceService, private router: Router) { }

  ngOnInit() {
    this.pieceService.getAll().subscribe(
      pendencies => this.pendencies = pendencies.sort((a,b)=> a.id - b.id),
      error => alert('Erro ao carregar a lista')
    )

    this.cols = [
        { field: 'id', header: 'ID' },
        { field: 'nome', header: 'NOME' },
        { field: 'codigo', header: 'CÓDIGO' },
        { field: 'valor', header: 'VALOR' },
        { field: 'tipo', header: 'TIPO' },
        { field: 'created', header: 'CRIADO' },
        { field: 'modified', header: 'MODIFICADO' },
        { field: 'status', header: 'STATUS' }
    ];

    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
          return true;
      }

      if (value === undefined || value === null) {
          return false;
      }
      
      return parseInt(filter) > value;
  }
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
  editPendency(id){
    console.log(id);
    this.router.navigateByUrl("pieces", {skipLocationChange: true}).then(
      () => this.router.navigate(['pieces', id, 'edit'])
    )
  }
  

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}
}
