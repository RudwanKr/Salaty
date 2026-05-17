import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../enviroments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private secretKey = environment.appKey;
  private iv = CryptoJS.enc.Utf8.parse('1234567890123456');

  constructor() {}

  encrypt(data: any): string {
    const jsonData = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      jsonData,
      CryptoJS.enc.Utf8.parse(this.secretKey),
      {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }

  decrypt(encryptedData: string): any | null {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedData,
        CryptoJS.enc.Utf8.parse(this.secretKey),
        {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (e) {
      console.error('فشل فك التشفير:', e);
      return null;
    }
  }
}
