import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { EncryptionService } from './encryption.service';
import { environment } from '../../../enviroments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HttpService implements OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ================= GET =================
  getRequest(url: string, params?: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(environment.baseUrl + url, { headers, params });
  }

  // ================= POST =================
  postRequest(url: string, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(
      environment.baseUrl + url,
      this.dataFormatter(data),
      { headers }
    );
  }

  // ================= PUT =================
  putRequest(url: string, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(
      environment.baseUrl + url,
      this.dataFormatter(data),
      { headers }
    );
  }

  // ================= MULTIPART =================
  multiPart(url: string, data: FormData): Observable<any> {
    const headers = this.getHeaders(true);
    return this.http.post(environment.baseUrl + url, data, { headers });
  }

  // ================= MULTIPART =================
  multiPartPut(url: string, data: FormData): Observable<any> {
    const headers = this.getHeaders(true);
    return this.http.put(environment.baseUrl + url, data, { headers });
  }

  // ================= DELETE =================
  deleteRequest(url: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(environment.baseUrl + url, { headers });
  }

  // ================= UNAUTH =================
  unAuthPostRequest(url: string, data: any): Observable<any> {
    // بدون فورماتر ولا تشفير
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    return this.http.post(environment.baseUrl + url, data, { headers });
  }

  unAuthGetRequest(url: string): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json'
    });
    return this.http.get(environment.baseUrl + url, { headers });
  }

  // ================= HEADERS =================
  private getHeaders(isMultipart: boolean = false): HttpHeaders {
    const userCredentials = this.getUserCredentials();
    const token = userCredentials?.token || '';

    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    if (!isMultipart) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  // ================= FORMATTER =================
  private dataFormatter(value: any): any {
    const userCredentials = this.getUserCredentials();

    const data = {
      userCredentials,
      date: this.getCurrentDateFormatted(),
      data: value,
    };

    return {
      encryptedData: this.encryption.encrypt(data),
    };
  }

  // ================= CREDENTIALS =================
  public getUserCredentials(): any {
    const encryptedCredentials = localStorage.getItem('userCredentials') ?? '';
    if (!encryptedCredentials) return null;

    return this.encryption.decrypt(encryptedCredentials);
  }

  // ================= DATE =================
  private getCurrentDateFormatted(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
