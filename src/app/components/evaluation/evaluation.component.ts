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
  evaluationForm2: FormGroup
  nuevo = false

  constructor(
    private builder: FormBuilder,
    private renderer: Renderer2,
    private evaluationService: EvaluationService) { }

  ngOnInit() {
    this.evaluationFormConfig()
    this.evaluationForm2Config()
    this.MostrarEvaluaciones()
  }

  evaluationForm2Config() {
    this.evaluationForm2 = this.builder.group({
      fechaInicio: [''],
      fechaFin: ['']
    })
  }

  evaluationFormConfig() {
    this.evaluationForm = this.builder.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      nombres: [''],
      apellidos: [''],
      calificacion: ['', [Validators.required, Validators.maxLength(2)]]
    })
  }

  MostrarEvaluaciones() {
    // this.evaluationService.ListarEvaluaciones().subscribe(res => {
    //   this.dataSource = new MatTableDataSource<evaluation>(res)
    //   this.dataSource.paginator = this.paginator
    // })
    this.evaluationService.ListarEvaluacionesSoap().subscribe(res => {
      // console.log(res);
      let doc = new DOMParser().parseFromString(res, 'text/xml');
      let valueXML = doc.getElementsByTagName('GetAllSoapResult');
      let temps = valueXML[0].children;
      let temp;
      let list = [];
      let obj;
      for (let i = 0; i < temps.length; i++) {
        temp = temps[i].children;
        obj = {};
        for (let j = 0; j < temp.length; j++) {
          let property = temp[j];

          obj[property.localName] = property.innerHTML;
        }
        list.push(obj);
      }
      // console.log(list);
      this.dataSource = new MatTableDataSource<evaluation>(list);
      this.dataSource.paginator = this.paginator;
    });
  }

  EditarEvaluacion(e: any) {
    // console.log(e)
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
    procesarEvaluacionRequest.qualification = Number(values.calificacion)
    if (this.nuevo) {
      this.evaluationService.AgregarEvaluacion(procesarEvaluacionRequest).subscribe(res => {
        this.MostrarEvaluaciones()
        this.configurarModal()
      })
    } else {
      procesarEvaluacionRequest.id = Number(values.id)
      // console.log(procesarEvaluacionRequest)
      this.evaluationService.EditarEvaluacion(procesarEvaluacionRequest).subscribe(res => {
        this.MostrarEvaluaciones()
        this.configurarModal()
      })
    }
  }

  ConsultarEvaluaciones(values: any) {
    // console.log(values)
    let i = values.fechaInicio.toLocaleDateString().split('/')
    let f = values.fechaFin.toLocaleDateString().split('/')
    let inicio = `${i[2]}-${i[1]}-${i[0]}`
    let fin = `${f[2]}-${f[1]}-${f[0]}`
    this.evaluationService.ListarEvaluacionesRangoFecha(inicio, fin).subscribe(res => {
      this.dataSource = new MatTableDataSource<evaluation>(res)
      this.dataSource.paginator = this.paginator
    })
  }
}