import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';

import { CalendarModule } from "primeng/calendar"
import {AutoCompleteModule} from 'primeng/autocomplete';
import {LightboxModule} from 'primeng/lightbox';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CategoryListComponent, CategoryFormComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    AutoCompleteModule,
    FormsModule,
    LightboxModule
  ]
})
export class CategoriesModule { }
