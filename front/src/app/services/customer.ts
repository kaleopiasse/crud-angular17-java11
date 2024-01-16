import { SortColumn, SortDirection } from "../components/table/sortable.directive";
import { IAddress } from "./address";

export interface ICustomer {
  id?: number;
  name: string;
  email: string;
  gender: string;
  addresses?: IAddress[];
}

export interface IState {
	page: number;
	pageSize: number;
	searchTermName: string;
  searchTermEmail: string;
  searchTermGender: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}
