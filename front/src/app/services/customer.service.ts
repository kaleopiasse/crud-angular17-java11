import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, debounceTime, delay, map, of, switchMap, tap } from 'rxjs';
import { ICustomer, IState } from './customer';
import { SortColumn, SortDirection } from '../components/table/sortable.directive';
import { DateUtils } from '../utils/date.utils';

@Injectable()
export class CustomerService {

	private _endpoint = 'http://localhost:9000/api/customers/'

	private _state: IState = {
		page: 0,
		pageSize: 5,
		searchTermName: '',
		searchTermEmail: '',
		searchTermGender: '',
		sortColumn: '',
		sortDirection: '',
	};

	public _search$ = new Subject<void>();
	private _loading$ = new BehaviorSubject<boolean>(true);
	private _total$ = new BehaviorSubject<number>(0);
	private _customers$ = new BehaviorSubject<ICustomer[]>([]);


	constructor(private http: HttpClient) {
		this._search$
			.pipe(
				tap(() => this._loading$.next(true)),
				debounceTime(200),
				catchError(err => { throw err }),
				switchMap(() => this.http.get<HttpResponse<any>>(this._getUrl(), { observe: 'response' })
					.pipe(
						map((res: HttpResponse<any>) => {
							const total = res.body.totalElements;
							const customers = res.body.content || res.body;
							return ({ total, customers })
						})
					)),
				delay(200),
				tap(() => this._loading$.next(false)),
			)
			.subscribe((result) => {
				this._customers$.next(result.customers);
				this._total$.next(result.total);
			});

		this._search$.next();
	}

	getClient(id: number): Observable<ICustomer> {
		return this.http.get(this._endpoint + '/' + id) as Observable<ICustomer>;
	}

	saveClient(body: ICustomer) {
		return this.http.post(this._endpoint, body);
	}

	editClient(id: number, body: ICustomer) {
		return this.http.put(this._endpoint + '/' + id, body);
	}

	deleteClient(id: number) {
		return this.http.delete(this._endpoint + '/' + id);
	}

	get customers$() {
		return this._customers$;
	}
	get total$() {
		return this._total$.asObservable();
	}
	get loading$() {
		return this._loading$.asObservable();
	}
	get page() {
		return this._state.page;
	}
	get pageSize() {
		return this._state.pageSize;
	}
	get searchTermName() {
		return this._state.searchTermName;
	}
	get searchTermEmail() {
		return this._state.searchTermEmail;
	}
	get searchTermGender() {
		return this._state.searchTermGender;
	}

	set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
	set searchTermName(searchTermName: string) {
		this._set({ searchTermName });
	}
	set searchTermEmail(searchTermEmail: string) {
		this._set({ searchTermEmail });
	}
	set searchTermGender(searchTermGender: string) {
		this._set({ searchTermGender });
	}
	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<IState>) {
		Object.assign(this._state, patch);
		this._getUrl();
		this._search$.next();
	}

	private _getUrl() {
		let url: string = this._endpoint;

		if(this._state.searchTermName || this._state.searchTermEmail || this._state.searchTermGender) {
			url += 'search'
			url += `?name=${this._state.searchTermName ? this.searchTermName : null}`
			url += `&email=${this._state.searchTermEmail ? this._state.searchTermEmail : null}`
			url += `&gender=${this.searchTermGender ? this._state.searchTermGender : null}`
			url += '&city=null'
			url += '&state=null'
		} else {
			url += `?page=${this._state.page-1}&size=${this._state.pageSize}`
		}

		return url;
	}

}
