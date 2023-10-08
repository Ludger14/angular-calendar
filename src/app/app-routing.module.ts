import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { FormularioCompromissoComponent } from './components/formulario-compromisso/formulario-compromisso.component';

const routes: Routes = [
  { path: '', component: CalendarioComponent },
  { path: 'add-appointment', component: FormularioCompromissoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
