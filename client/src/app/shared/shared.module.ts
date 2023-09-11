import { NgModule } from '@angular/core';

//primeng
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
    declarations: [],
    imports: [
        ToastModule,
        ButtonModule,
        TabMenuModule,
        ProgressSpinnerModule
    ],
    exports: [
        ToastModule,
        ButtonModule,
        TabMenuModule,
        ProgressSpinnerModule
    ]
})

export class SharedModule { }