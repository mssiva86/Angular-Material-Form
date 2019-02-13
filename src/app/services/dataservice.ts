import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Options } from '../Interface/response';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private endpoint = environment.baseUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };




  constructor (private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }


  /*getData(attribute): Observable<any> {
    return this.http.get(this.endpoint + attribute).pipe(
      map(this.extractData));

  } */


  getData(): Observable<any> {
    let areasRequest = this.http.get(this.endpoint + "areas").pipe(
      map(this.extractData));
    let authorRequest = this.http.get(this.endpoint + "authors").pipe(map(this.extractData));
    let governingRequest = this.http.get(this.endpoint + "governingBodies").pipe(map(this.extractData));
    let citationsRequest = this.http.get(this.endpoint + "citations").pipe(map(this.extractData));
    let filetypesRequest = this.http.get(this.endpoint + "fileTypes").pipe(map(this.extractData));
    let geographyTypesRequest = this.http.get(this.endpoint + "geographyTypes").pipe(map(this.extractData));
    let industriesRequest = this.http.get(this.endpoint + "industries").pipe(map(this.extractData));
    let subAreasRequest = this.http.get(this.endpoint + "subAreas").pipe(map(this.extractData));
    let productRequest = this.http.get(this.endpoint + "products").pipe(map(this.extractData));
    let synonymsRequest = this.http.get(this.endpoint + "synonyms").pipe(map(this.extractData));
    let templateTypesRequest = this.http.get(this.endpoint + "templateTypes").pipe(map(this.extractData));
    let contentSubTypesRequest = this.http.get(this.endpoint + "contentSubTypes").pipe(map(this.extractData));
    let contentTypesRequest = this.http.get(this.endpoint + "contentTypes").pipe(map(this.extractData));
    let geographiesRequest = this.http.get(this.endpoint + "geographies").pipe(map(this.extractData));
    return forkJoin([areasRequest, authorRequest, governingRequest, citationsRequest, filetypesRequest,
      geographyTypesRequest, industriesRequest, subAreasRequest, productRequest, synonymsRequest, templateTypesRequest,
      contentSubTypesRequest, contentTypesRequest, geographiesRequest]).pipe(catchError(error => of(error)));
  }  








  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);  //log the error to console.
      console.log(~`${operation}failed: ${error.message}`); //better job of transforming error for user consumption
      return of(result as T);
    };
  }
}



