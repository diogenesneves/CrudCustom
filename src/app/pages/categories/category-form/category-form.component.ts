import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms'
import { ActivatedRoute, Router} from '@angular/router'

import { Pendency } from '../shared/pendency.model'
import {PendencyService} from '../shared/pendency.service'

import { switchMap } from 'rxjs/operators'

import toastr from "toastr"

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
  
  constructor(
    private pendencyService: PendencyService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildPendencyForm();
    this.loadPendency();
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction = "new")
      this.createPendency();
    else
      this.updatePendency();
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
      descricao: [null, [Validators.required, Validators.minLength(5)]],
      corDoBanho: [null, [Validators.required]],
      dataPedido: [null, [Validators.required]],
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
          this.pendency = pendency;
          this.pendencyForm.patchValue(this.pendency) // binds loaded pendency data to pendencyForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
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
    const pendency: Pendency = Object.assign(new Pendency(), this.pendencyForm.value)

    this.pendencyService.create(pendency)
      .subscribe( 
        pendency => this.actionsForSucess(pendency),
        error => this.actionsForError(error)
      )
  }

  private updatePendency(){
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
