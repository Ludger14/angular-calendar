import { Time } from '@angular/common';
import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Calendar } from 'src/app/model/calendar.model';
import { AlertModalService } from 'src/app/services/alert-modal.service';

@Component({
  selector: 'app-formulario-compromisso',
  templateUrl: './formulario-compromisso.component.html',
  styleUrls: ['./formulario-compromisso.component.css']
})
export class FormularioCompromissoComponent implements OnInit {

  titulo: string = '';
  appointment: Date;

  listAppointment: Calendar = new Calendar();

  startAppointment: Time;
  endAppointment: Time;

  form: FormGroup;

  currentTime: string;

  validationFailed: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormularioCompromissoComponent>, private fb: FormBuilder, private alertModalService: AlertModalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.titulo = data['titulo'];
    this.listAppointment.data = data['appointment'];
    this.listAppointment.title = data['title'];
    this.listAppointment.start = data['start'];
    this.listAppointment.end = data['end'];
    this.listAppointment.description = data['description'];

    this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]], 
      start: ['', [Validators.required,]], 
      end: ['', [Validators.required]], 
    }, { validator: this.timeValidator() });
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  submit(form: any) {
    if(form.invalid){
        this.alertModalService.mostrarMensagem("Fields must be filled.", this.alertModalService.ERRO);
    } else{
      this.dialogRef.close(this.listAppointment);
    }
  }

  isTimeDisabled(): boolean {
    const selectedTime = this.form.get('start').value;
    return selectedTime < this.currentTime;
  }

  isTimeEndDisabled(): boolean {
    const selectedTime = this.form.get('end').value;
    return selectedTime < this.currentTime;
  }

  timeValidator = () => (formGroup: FormGroup) => {
    const startTime = formGroup.get('start').value;
    const endTime = formGroup.get('end').value;

    if (startTime && endTime && startTime >= endTime) {
      formGroup.get('end').setErrors({ invalidEndTime: true }); 
      this.validationFailed = true;
    } else {
      formGroup.get('end').setErrors(null);
      this.validationFailed = false;
    }
  }

  start(){
    const selectedStartTime = new Date(this.form.get('start')?.value);
    const currentTime = new Date();

    if (selectedStartTime <= currentTime) {
      this.form.get('start').setErrors({ invalidTime: true });
    } else{
      this.startAppointment = this.form.get('start')?.value;
    }
    
  }

  end(){
    if(this.validationFailed){           
      this.form.controls['end'].setValue(null);
      this.listAppointment.end = null;
    } else{
      this.listAppointment.end = this.form.controls['end'].value;
    }
    
  }

}
