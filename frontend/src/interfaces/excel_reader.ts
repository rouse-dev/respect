import { StudentData } from "./student";

export interface ExcelReaderProps {
  setData: (data: StudentData[]) => void;
}