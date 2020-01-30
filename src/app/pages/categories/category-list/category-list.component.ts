import { Component, OnInit } from '@angular/core';
import { PendencyService } from '../shared/pendency.service';
import { Pendency } from '../shared/pendency.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  pendencies: Pendency[] = [];

  constructor(private categoryService: PendencyService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      pendencies => this.pendencies = pendencies,
      error => alert('Erro ao carregar a lista' )
    )
  }

  deletePendency(pendency) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.categoryService.delete(pendency.id).subscribe(
        () => this.pendencies = this.pendencies.filter(element => element != pendency),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }

}
