import { Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateUpdateComponent } from './pages/create-update/create-update.component';
import { CreateUpdateAddressComponent } from './pages/create-update-address/create-update-address.component';

export const routes: Routes = [
  {
    path:'', component: ListComponent,
  },
  {
    path: 'create', component: CreateUpdateComponent,
    data: {
      title: 'ADICIONAR CLIENTE'
    }
  },
  {
    path: 'details/:id', component: CreateUpdateComponent,
    data: {
      title: 'DETALHES DO CLIENTE'
    }
  },
  {
    path: 'create-address', component: CreateUpdateAddressComponent,
    data: {
      title: 'ADICIONAR ENDEREÇO'
    }
  },
  {
    path: 'details-address/:id', component: CreateUpdateAddressComponent,
    data: {
      title: 'ENDEREÇOS DO CLIENTE'
    }
  }
];
