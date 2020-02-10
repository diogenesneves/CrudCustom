import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PiecesRoutingModule } from './pieces-routing.module';
import { PieceListComponent } from './piece-list/piece-list.component';
import { PieceFormComponent } from './piece-form/piece-form.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from "primeng/calendar"
import {FileUploadModule} from 'primeng/fileupload';
import {TableModule} from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { SearchPipe } from './shared/search.pipe';

import {IMaskModule} from 'angular-imask';


@NgModule({
  declarations: [PieceListComponent, PieceFormComponent, SearchPipe],
  imports: [
    CommonModule,
    PiecesRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    FileUploadModule,
    TableModule,
    DropdownModule,
    IMaskModule
  ]
})
export class PiecesModule { }
