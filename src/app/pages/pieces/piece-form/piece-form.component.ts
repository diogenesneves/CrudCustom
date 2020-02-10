import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router'

import { Piece } from '../shared/piece.model'
import { PieceService } from '../shared/piece.service'

import { switchMap } from 'rxjs/operators'

import toastr from "toastr"

@Component({
  selector: 'app-piece-form',
  templateUrl: './piece-form.component.html',
  styleUrls: ['./piece-form.component.css']
})
export class PieceFormComponent implements OnInit {

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

  imaskConfig ={
    mask: Number,
    scale: 2,
    thoushandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  currentAction: string;
  pieceForm: FormGroup;
  pageTitle: string;
  imageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean =false;
  piece: Piece = new Piece();
  uploadedFiles: any[]=[];
  chargeFiles: any[]=[];
  imageURL: string;
  
  constructor(
    private pieceService: PieceService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildPieceForm();
    this.loadPiece();
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  // Image Preview
  showPreview(event) {
    const file = (event as HTMLInputElement).files[0];
    
    this.pieceForm.patchValue({
      photo: file
    });
    this.pieceForm.get('photo').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createpiece();
    else
      this.updatepiece();
  }

  // PRIVATE METHODS

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildPieceForm() {
    this.pieceForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      codigo: [null, [Validators.required, Validators.minLength(5)]],
      valor: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      photo: [null],
      status: [true, [Validators.required]],
      obs: [null]

    })
  }

  private loadPiece() {
    if(this.currentAction == "edit"){

      this.route.paramMap.pipe(
        switchMap(params => this.pieceService.getById(+params.get("id")))
      )
      .subscribe(
        (piece) => {
          this.piece = piece;
          this.chargeFiles=[1]
          this.pieceForm.patchValue(this.piece) // binds loaded piece data to pieceForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de Nova Peça'
      this.imageTitle = 'Selecione uma imagem'
    }else{
      const pieceNome = this.piece.nome || ''
      this.pageTitle = 'Editando Peça: '+ pieceNome;
      this.imageTitle = 'Trocar imagem'
    }
  }

  private createpiece(){
    //const piece: Piece = Object.assign(new Piece(), this.pieceForm.value)
    var formData: any = new FormData();
      formData.append("nome", this.pieceForm.get('nome').value);
      formData.append("codigo", this.pieceForm.get('codigo').value);
      formData.append("valor", this.pieceForm.get('valor').value);
      formData.append("tipo", this.pieceForm.get('tipo').value);
      formData.append("photo", this.pieceForm.get('photo').value);
      formData.append("status", this.pieceForm.get('status').value);
      formData.append("obs", this.pieceForm.get('obs').value);

    this.pieceService.create(formData)
      .subscribe( 
        piece => this.actionsForSucess(piece),
        error => this.actionsForError(error)
      )
  }

  private updatepiece(){
    const piece: Piece = Object.assign(new Piece(), this.pieceForm.value);

    this.pieceService.update(piece)
    .subscribe( 
      piece => this.actionsForSucess(piece),
      error => this.actionsForError(error)
    )
  }

  private actionsForSucess(piece: Piece){
    toastr.success("Solicitação processada com sucesso!");



    // REDIRECT/RELOAD COMPONENT PAGE
    this.router.navigateByUrl("pieces", {skipLocationChange: true}).then(
      () => this.router.navigate(['pieces', piece.id, 'edit'])
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
