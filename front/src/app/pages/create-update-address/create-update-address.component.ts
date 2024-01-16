import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { EMPTY, catchError, tap } from 'rxjs';

import { MsgsInputValidation } from '../../utils/string.utils';
import { IAddress } from '../../services/address';
import { AddressService } from '../../services/address.service';
import { FormUtils } from '../../utils/form.utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-update-address',
  standalone: true,
  imports: [CommonModule, NgxMaskDirective, NgxMaskPipe, ReactiveFormsModule],
  templateUrl: './create-update-address.component.html',
  styleUrl: './create-update-address.component.css',
  providers: [AddressService, NgbModal, NgxMaskPipe]
})
export class CreateUpdateAddressComponent implements OnInit {
  title: String = ''

  form = this.formBuilder.group({
    cep: new FormControl('',[Validators.required, Validators.minLength(8)]),
    street: new FormControl('', [Validators.required ]),
    neighborhood: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required])
  })

  @ViewChild('modalCreateUpdate') modalContent!: NgbModalRef;
  modal = { modalIcon: '', modalMsg: ''}
  errorMsgs: Record<string, string> = MsgsInputValidation

  id = this.activatedRoute.snapshot.params['id'];

  addresses: IAddress[] = [];

  addAddress = true;


  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly addressService: AddressService,
    private readonly formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) {}

  ngOnInit() {
    FormUtils.disableControls(this.form, ['street', 'neighborhood', 'city', 'state'])

    this.activatedRoute.data.pipe(
      tap((res) => this.title = res['title'])
    ).subscribe()

    this._getAddressesByClient(this.id);

    this.form.controls.cep.valueChanges.pipe(
      tap(cep => {
        if(this.form.controls.cep.valid && cep) {
          this.addressService.getAddressByCep(cep).pipe(
            tap(res => {
              if (res.erro) throw HttpErrorResponse;
              
              this.form.controls.street.setValue(res.logradouro)
              this.form.controls.neighborhood.setValue(res.bairro)
              this.form.controls.city.setValue(res.localidade)
              this.form.controls.state.setValue(res.uf)
            }),
            catchError(() => {
              this.modal.modalIcon = 'bi-exclamation-circle';
              this.modal.modalMsg = 'Não encontramos o endereço, verifique o CEP informado';
              this.modalService.open(this.modalContent, { centered: true })
              return EMPTY;
            })
          ).subscribe();
        }
      })
    ).subscribe();
  }

  createBodyAddress(id?: string) {

    if(!this.addAddress) {
      this.addAddress = !this.addAddress;
      return;
    }

    if(this.form.invalid) {
      this._formMsgsValidation();
      this.modalService.open(this.modalContent, { centered: true });
      return;
    }

    const body: IAddress = {
      cep: this.form.controls.cep.value || '',
      street: this.form.controls.street.value || '',
      neighborhood: this.form.controls.neighborhood.value || '',
      city: this.form.controls.city.value || '',
      state: this.form.controls.state.value || ''
    }

    if(!id) {
      this._saveAddress(body);
    } else {
      this._editAddress(body);
    }
  }

  returnPageList() {
    this.router.navigate(['']);
  }

  closeModal() {
    if (this.modal.modalIcon == 'bi-check-circle') this.returnPageList();
    this.modalService.dismissAll();
  }

  private _getAddressesByClient(id: number) {
    this.addressService.getAllAddressesByClient(id).pipe(
      tap(res => {
        this.addresses = res;
        this.addAddress = this.addresses.length <= 0
      }),
      catchError(() => {
        this.router.navigate(['']);
        return EMPTY;
      })
    ).subscribe();
  }

  private _editAddress(body: IAddress) {
    this.addressService.saveAddress(this.id,body).pipe(
      tap(() =>{
        this.modal.modalIcon = 'bi-check-circle';
        this.modal.modalMsg = 'Endereço editado com sucesso'

        this.modalService.open(this.modalContent, { centered: true })
      })
    ).subscribe()
  }

  private _saveAddress(body: IAddress) {
    this.addressService.saveAddress(this.id, body).pipe(
      tap(() =>{
        this.modal.modalIcon = 'bi-check-circle';
        this.modal.modalMsg = 'Endereço adicionado com sucesso'

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
