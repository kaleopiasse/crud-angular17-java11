import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { EMPTY, catchError, tap } from 'rxjs';

import { CustomerService } from '../../services/customer.service';
import { ICustomer } from '../../services/customer';
import { AgeValidator } from '../../validators/age.validator';
import { CpfValidator } from '../../validators/cpf.validator';
import { FullNameValidator } from '../../validators/fullName.validator';
import { MsgsInputValidation } from '../../utils/string.utils';
import { DateUtils } from '../../utils/date.utils';

@Component({
  selector: 'app-create-update',
  standalone: true,
  imports: [CommonModule, NgxMaskDirective, NgxMaskPipe, ReactiveFormsModule],
  templateUrl: './create-update.component.html',
  styleUrl: './create-update.component.css',
  providers: [CustomerService, NgbModal, NgxMaskPipe]
})
export class CreateUpdateComponent implements OnInit {
  title: String = ''

  form = this.formBuilder.group({
    name: new FormControl('',[Validators.required, FullNameValidator.validator]),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required])
  })

  @ViewChild('modalCreateUpdate') modalContent!: NgbModalRef;
  modal = { modalIcon: '', modalMsg: ''}
  errorMsgs: Record<string, string> = MsgsInputValidation

  id = this.activatedRoute.snapshot.params['id'];
  private today = new Date().getTime();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly ngxMaskPipe: NgxMaskPipe,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.data.pipe(
      tap((res) => this.title = res['title'])
    ).subscribe()

    if(this.id) {
      this._getClient(this.id);
    }
  }

  createBodyClient() {
    if(this.form.invalid) {
      this._formMsgsValidation();
      this.modalService.open(this.modalContent, { centered: true });
      return;
    }

    const {name,email,gender } = this.form.value

    const body: ICustomer = {
      name: name || '',
      email: email || '',
      gender: gender || ''
    }

    if(!this.id) {
      this._saveClient(body);
    } else {
      this._editClient(body);
    }
  }

  returnPageList() {
    this.router.navigate(['']);
  }

  closeModal() {
    if (this.modal.modalIcon == 'bi-check-circle') this.returnPageList();
    this.modalService.dismissAll();
  }

  private _getClient(id: number) {
    this.customerService.getClient(id).pipe(
      tap(res => {
        this.form.setValue(
          {
            name: res.name,
            email: res.email,
            gender: res.gender
          })
      }),
      catchError(() => {
        this.router.navigate(['']);
        return EMPTY;
      })
    ).subscribe();
  }

  private _editClient(body: ICustomer) {
    this.customerService.editClient(this.id,body).pipe(
      tap(() =>{
        this.modal.modalIcon = 'bi-check-circle';
        this.modal.modalMsg = 'Cliente editado com sucesso'

        this.modalService.open(this.modalContent, { centered: true })
      })
    ).subscribe()
  }

  private _saveClient(body: ICustomer) {
    this.customerService.saveClient(body).pipe(
      tap(() =>{
        this.modal.modalIcon = 'bi-check-circle';
        this.modal.modalMsg = 'Cliente adicionado com sucesso'

        this.modalService.open(this.modalContent, { centered: true })
      })
    ).subscribe()
  }

  private _formMsgsValidation() {
    let errors: any[] = [];
    this.modal.modalIcon = 'bi-exclamation-circle'
    this.modal.modalMsg = '';

    Object.keys(this.form.controls).forEach(key => {
      if(this.form.get(key)?.errors) {
        let controlsErrors = this.form.get(key)?.errors
        if(controlsErrors) Object.keys(controlsErrors).forEach(key => errors.push(key))
      };
    });
    errors = [...new Set(errors)]

    errors.forEach((item: any) => this.modal.modalMsg += `${this.errorMsgs[item]} <br>`)
  }
}
