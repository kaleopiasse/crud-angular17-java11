import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbHighlight, NgbPaginationModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, tap } from 'rxjs';
import { NgxMaskPipe, NgxMaskDirective } from 'ngx-mask';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { ICustomer } from '../../services/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [CommonModule, DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, NgxMaskPipe, NgxMaskDirective],
	templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [CustomerService, DatePipe, NgbModal]
})
export class TableComponent {

  @Input() data = new Observable<ICustomer[]>
	customers$: Observable<ICustomer[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  @ViewChild('modalDelete') modalContent!: NgbModalRef;

  modalRef!: NgbModalRef;
  modal = { modalIcon: '', modalMsg: '', step: 1 };
  clientId!:  number;

	constructor(
    public readonly customerService: CustomerService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) {
		this.customers$ = customerService.customers$;
		this.total$ = customerService.total$;
	}

	onSort({ column, direction }: SortEvent) {
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.customerService.sortColumn = column;
		this.customerService.sortDirection = direction;
	}

  addClient() {
    this.router.navigate(['create']);
  }

  addAddress(id: string) {
    this.router.navigate(['create-address', id]);
  }

  viewDetails(id: number | undefined) {
    this.router.navigate(['details', id]);
  }

  viewDetailsAddress(id: number | undefined) {
    this.router.navigate(['details-address', id]);
  }

  verifyDelete(id: number) {
    this.clientId = id;
    if(this.modal.step === 1) {
      this.modal.modalIcon = 'bi-exclamation-circle';
      this.modal.modalMsg = 'Você tem certeza que deseja excluir este cliente?'
      this.modalRef = this.modalService.open(this.modalContent, { centered: true })
    }
  }

  confirmBtnModal() {
    if(this.modal.step === 1) {
      this.modal.step += 1;
      if(this.clientId) this.customerService.deleteClient(this.clientId).pipe(
        tap(()=> {
          this.modal.modalIcon = 'bi-check-circle';
          this.modal.modalMsg = 'Cliente excluido com sucesso'
        })
      ).subscribe();
    } else {
      this.customerService._search$.next();
      this.modalService.dismissAll();
      this.modal.step = 1
    }
  }
}
