import { Group } from "./group";

export interface Student {
  id: number;
  name: string;
  groups: Group;
  email:string;
  groupsId: number;
  reputation: number;
}

export interface StudentDebtRequest{
  id:number;
  name:string;
  email:string;
}

export interface StudentData {
  id?: number;
  name: string;
  groupsId: number;
}