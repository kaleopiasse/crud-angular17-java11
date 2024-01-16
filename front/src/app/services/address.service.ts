import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IAddress } from './address';

@Injectable()
export class AddressService {

	private _endpoint = 'http://localhost:9000/api/customers/'


	constructor(private http: HttpClient) {}

	getAllAddressesByClient(id: number): Observable<IAddress[]> {
		return this.http.get(this._endpoint + '/' + id + '/addresses' ) as Observable<IAddress[]>;
	}

	getAddressByCep(cep: string): Observable<any> {
		return this.http.get('https://viacep.com.br/ws/'+`${cep}`+'/json');
	}

	saveAddress(id: string, body: IAddress): Observable<IAddress> {
		return this.http.post(this._endpoint + '/' + id + '/addresses', body) as Observable<IAddress>;
	}

}
