import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { evaluation } from '../interfaces/evaluation';
import { ProcesarEvaluacionRequest } from '../request/ProcesarEvaluacionRequest';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private urlBase: string = `https://localhost:44326/api/Evaluation/`
  private urlBaseSoap: string = `https://localhost:44326/EvaluationService.asmx`

  constructor(private httpClient: HttpClient) { }

  ListarEvaluaciones(): Observable<evaluation[]> {
    return this.httpClient.get<evaluation[]>(`${this.urlBase}`)
  }

  ListarEvaluacionesRangoFecha(fechaInicio: string, fechaFin: string): Observable<evaluation[]> {
    return this.httpClient.get<evaluation[]>(`${this.urlBase}GetAllByDateRange?begin=${fechaInicio}&end=${fechaFin}`)
  }

  AgregarEvaluacion(procesarEvaluacionRequest: ProcesarEvaluacionRequest): Observable<Response> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.httpClient.post<Response>(`${this.urlBase}AddEvaluation`, procesarEvaluacionRequest, { headers })
  }

  EditarEvaluacion(procesarEvaluacionRequest: ProcesarEvaluacionRequest): Observable<Response> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.httpClient.put<Response>(`${this.urlBase}${procesarEvaluacionRequest.id.toString()}`, procesarEvaluacionRequest, { headers })
  }

  ListarEvaluacionesSoap(): any {
    let headers = new HttpHeaders({
      'type': 'POST',
      'Content-Type': 'text/xml; charset=\"utf-8\"',
      'dataType': 'xml'
    })
    let body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetAllSoap xmlns="http://tempuri.org/">
        </GetAllSoap>
      </soap:Body>
    </soap:Envelope>`
    return this.httpClient.post(`${this.urlBaseSoap}`, body, { headers, responseType: 'text' })
  }


}