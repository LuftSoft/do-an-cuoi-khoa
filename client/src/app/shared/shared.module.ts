import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

//primeng
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [],
    imports: [
        ToastModule,
        ButtonModule,
        TabMenuModule,
        PasswordModule,
        CheckboxModule,
        InputTextModule,
        RadioButtonModule,
        ProgressSpinnerModule
    ],
    exports: [
        ChartModule,
        CommonModule,
        ToastModule,
        ButtonModule,
        TabMenuModule,
        PasswordModule,
        CheckboxModule,
        InputTextModule,
        RadioButtonModule,
        FormsModule,
        ProgressSpinnerModule
    ]
})

export class SharedModule { }