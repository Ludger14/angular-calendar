import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormularioCompromissoComponent } from '../formulario-compromisso/formulario-compromisso.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { Calendar } from 'src/app/model/calendar.model';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  compromissos: Array<Calendar> = [];

  minSelectableDate: Date;

  selectedDate: Date;

  constructor(public dialog: MatDialog, private dateAdapter: DateAdapter<Date>, private alertModalService: AlertModalService,
    private route : Router, private router: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    this.minSelectableDate = this.dateAdapter.addCalendarDays(new Date(), 0); 
  }

  onDateSelect(event: any): void {
    this.selectedDate = event;
    this.openDialog();
  }

  openDialog(): void {
    this.route.navigate(['/add-appointment']);
    const dialogRef = this.dialog.open(FormularioCompromissoComponent, {
      width: '25rem',
      data: {
        titulo: 'Appointment',
        appointment: this.selectedDate,        
      },
      panelClass: 'mat-dialog-ur-panel',
      backdropClass: 'mat-dialog-ur-backdrop',
    });

    dialogRef.afterClosed().subscribe(result => {
        this.route.navigate(['']);
      if (result) {
        this.compromissos.push(result);
        this.alertModalService.mostrarMensagem("The meeting " + result.title + " is scheduled.", this.alertModalService.SUCESSO);
      }
    });
  }

  editCompromisso(index: number, compromisso: Calendar): void {
    const dialogRef = this.dialog.open(FormularioCompromissoComponent, {
      width: '250px',
      data: {
        titulo: 'Edit Appointment',
        title: compromisso.title,
        description: compromisso.description,
        start: compromisso.start,
        end: compromisso.end,
        appointment: compromisso.data,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.compromissos[index] = result;
        this.alertModalService.mostrarMensagem("The meeting " + result.title + " was successfully edited.", this.alertModalService.SUCESSO);
      }
    });
  }

  deleteCompromisso(index: number, dados: Calendar): void {
    this.compromissos.splice(index, 1);
    this.alertModalService.mostrarMensagem("The meeting " + dados.title + " was successfully deleted.", this.alertModalService.SUCESSO);
  }

  getDateClass = (date: Date): string => {
    const dateWithNoTime = this.dateAdapter.clone(date);
    dateWithNoTime.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.dateAdapter.compareDate(date, today) < 0) {
        return 'past-date';
    }
    
    const matchingCompromissos = this.compromissos.some(
      compromisso => this.dateAdapter.compareDate(dateWithNoTime, compromisso.data) === 0
    );

    return matchingCompromissos ? 'has-compromisso' : '';
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.compromissos, event.previousIndex, event.currentIndex);
  }

  reOrdemList(event: CdkDragDrop<Calendar[]>){
    moveItemInArray(this.compromissos, event.previousIndex, event.currentIndex);
}

upCompromisso(index: number){
    if (index > 0) {
        [this.compromissos[index], this.compromissos[index - 1]] = [this.compromissos[index - 1], this.compromissos[index]];
        this.compromissos.forEach((compromisso, i) => {
          compromisso.ordem = i + 1;
        });
    }
}

downCompromisso(index: number){
    if (index < this.compromissos.length - 1) {
        [this.compromissos[index], this.compromissos[index + 1]] = [this.compromissos[index + 1], this.compromissos[index]];
        this.compromissos.forEach((compromisso, i) => {
          compromisso.ordem = i + 1;
        });
    }
}

}

