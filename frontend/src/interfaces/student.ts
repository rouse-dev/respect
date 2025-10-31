import { Group } from "./group";

export interface Student {
  id: number;
  name: string;
  groups: Group;
  groupsId: number;
  reputation: number;
}

export interface StudentData {
  id?: number;
  name: string;
  groupsId: number;
}