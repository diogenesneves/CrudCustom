import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router'

import { Pendency } from '../shared/pendency.model'
import {PendencyService} from '../shared/pendency.service'

import { switchMap } from 'rxjs/operators'

import toastr from "toastr"
import { PieceService } from '../../pieces/shared/piece.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  currentAction: string;
  pendencyForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean =false;
  pendency: Pendency = new Pendency();
  customPiece: any[] = [];
  photo: string = "";
  photoShow: boolean = false;
  images: any[];
  filteredPieces: any[];
  piece: string;
  matchID: string = "";

  nomePeca: string;
  
  constructor(
    private pendencyService: PendencyService,
    private pieceService: PieceService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildPendencyForm();
    this.loadPendency();
    this.loadPiece();
  }
  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createPendency();
    else
      this.updatePendency();
  }
  filterPieces(event) {
    console.log(this.customPiece, "piece")
    this.filteredPieces = [];
    for(let i = 0; i < this.customPiece.length; i++) {
        let piece = this.customPiece[i].nome;
        if(piece.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.filteredPieces.push(piece);
        }
    }
  }
  matchId(data){
    var index,value;
    for (index = 0; index < this.customPiece.length; ++index) {
      value = this.customPiece[index].nome;
    if (value === data) {
        this.matchID = this.customPiece[index].id;
        this.photo = this.customPiece[index].photo;
        this.photoShow = true;
        break;
      }
    }
  }
  // PRIVATE METHODS

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildPendencyForm() {
    this.pendencyForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      custom_piece_id: [null,Validators.required],
      descricao: [null, [Validators.required, Validators.minLength(5)]],
      cordobanho: [null, [Validators.required]],
      status: [false, [Validators.required]],
      obs: [null],
    })
  }

  private loadPendency() {
    if(this.currentAction == "edit"){

      this.route.paramMap.pipe(
        switchMap(params => this.pendencyService.getById(+params.get("id")))
      )
      .subscribe(
        (pendency) => {
          this.pendency = pendency[0];
          this.matchID = pendency[0].custom_piece_id;
          this.photo = pendency[0].custom_piece.photo;
          this.photoShow = true;
          this.pendencyForm.patchValue(
            {id: pendency[0].id,
            nome: pendency[0].nome,
            custom_piece_id: pendency[0].custom_piece.nome,
            descricao: pendency[0].descricao,
            cordobanho: pendency[0].cordobanho,
            status: pendency[0].status,
            obs: pendency[0].obs}
          ) // binds loaded pendency data to pendencyForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }
  private loadPiece() {
    this.pieceService.getAll().subscribe(
      pieces => this.customPiece = pieces,
      error => alert('Erro ao carregar a lista')
    )
  }

  private setPageTitle() {
    if(this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Novo Pedido'
    else{
      const pendencyNome = this.pendency.nome || ''
      this.pageTitle = 'Editando Pedido: '+ pendencyNome;
    }
  }

  private createPendency(){
    // SET CUSTOM PIECE ID IN FORM VALUE
    this.pendencyForm.value.custom_piece_id = this.matchID;
    const pendency: Pendency = Object.assign(new Pendency(), this.pendencyForm.value)

    this.pendencyService.create(pendency)
      .subscribe( 
        pendency => this.actionsForSucess(pendency),
        error => this.actionsForError(error)
      )
  }

  private updatePendency(){
    this.pendencyForm.value.custom_piece_id = this.matchID;
    const pendency: Pendency = Object.assign(new Pendency(), this.pendencyForm.value);

    this.pendencyService.update(pendency)
    .subscribe( 
      pendency => this.actionsForSucess(pendency),
      error => this.actionsForError(error)
    )
  }

  private actionsForSucess(pendency: Pendency){
    toastr.success("Solicitação processada com sucesso!");



    // REDIRECT/RELOAD COMPONENT PAGE
    this.router.navigateByUrl("pendencies", {skipLocationChange: true}).then(
      () => this.router.navigate(['pendencies', pendency.id, 'edit'])
    )
  }

  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar a sua solicitação!')

    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]  
  }

}
