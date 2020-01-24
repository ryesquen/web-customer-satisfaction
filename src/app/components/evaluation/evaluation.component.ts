import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { evaluation } from '../../interfaces/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcesarEvaluacionRequest } from 'src/app/request/ProcesarEvaluacionRequest';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

  data: evaluation[]
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'qualification', 'evaluationDate', 'action']
  dataSource: MatTableDataSource<evaluation>
  modalActivo: boolean = false
  @ViewChild('blur') blur: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  evaluationForm: FormGroup
  nuevo = false

  constructor(
    private builder: FormBuilder,
    private renderer: Renderer2,
    private evaluationService: EvaluationService) { }

  ngOnInit() {
    this.evaluationFormConfig()
    this.MostrarEvaluaciones()
  }

  evaluationFormConfig() {
    this.evaluationForm = this.builder.group({
      id: [''],
      email: ['', Validators.required],
      nombres: [''],
      apellidos: [''],
      calificacion: ['', Validators.required]
    })
  }

  MostrarEvaluaciones() {
    this.evaluationService.ListarEvaluaciones().subscribe(res => {
      this.dataSource = new MatTableDataSource<evaluation>(res)
      this.dataSource.paginator = this.paginator
    })
    // this.evaluationService.ListarEvaluacionesSoap().subscribe(res => {
    //   console.log(res)
    // },err=>{
    //   console.warn(err);
    // })
  }

  EditarEvaluacion(e: any) {
    console.log(e)
    this.LimpiarModal()
    if (e !== '') {
      this.nuevo = false
      this.evaluationForm.setValue(
        {
          id: e.id,
          email: e.email,
          nombres: e.firstName,
          apellidos: e.lastName,
          calificacion: e.qualification
        })
    } else {
      this.nuevo = true
    }
    this.configurarModal()
  }

  LimpiarModal() {
    this.evaluationForm.setValue(
      {
        id: '',
        email: '',
        nombres: '',
        apellidos: '',
        calificacion: ''
      })
  }

  configurarModal() {
    this.modalActivo = !this.modalActivo
    if (this.modalActivo) {
      this.renderer.addClass(this.blur.nativeElement, 'active')
      this.renderer.addClass(this.popup.nativeElement, 'active')
    }
    else {
      this.renderer.removeClass(this.blur.nativeElement, 'active')
      this.renderer.removeClass(this.popup.nativeElement, 'active')
    }
  }

  CerrarModal() {
    this.configurarModal()
  }

  ProcesarEvaluacion(values: any) {
    console.log(values)
    const procesarEvaluacionRequest = new ProcesarEvaluacionRequest()
    procesarEvaluacionRequest.email = values.email
    procesarEvaluacionRequest.firstname = values.nombres
    procesarEvaluacionRequest.lastname = values.apellidos
    procesarEvaluacionRequest.qualification = values.calificacion
    if (this.nuevo) {
      this.evaluationService.AgregarEvaluacion(procesarEvaluacionRequest).subscribe(res => {
        this.MostrarEvaluaciones()
        this.configurarModal()
      })
    } else {
      procesarEvaluacionRequest.id = values.id
      console.log(procesarEvaluacionRequest)
      this.evaluationService.EditarEvaluacion(procesarEvaluacionRequest).subscribe(res => {
        this.MostrarEvaluaciones()
        this.configurarModal()
      })
    }



  }
}