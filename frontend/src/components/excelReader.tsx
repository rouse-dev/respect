import * as XLSX from 'xlsx';
import { useCallback, useEffect, useState } from 'react';
import { ExcelReaderProps, useAppContext } from '../store/AppContext';
import { useDropzone } from 'react-dropzone';

const ExcelReader = ({ setData }: ExcelReaderProps) => {
  const { selectedGroup } = useAppContext();
  const [fileLoaded, setFileLoaded] = useState(false);

  const handleFile = (file: File) => {
    setFileLoaded(true);

    console.log(file)

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target?.result as string;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      const formattedData = jsonData.map((row) => ({
        name: `${row[0]} ${row[1]} ${row[2]}`,
        groupsId: selectedGroup?.id || 0
      }));

      if (formattedData[0]?.name.includes("Фамилия")) {
        formattedData.shift();
      }
      if (jsonData.length === 0) {
        alert('Excel таблица пуста!');
      } else {
        console.log(formattedData);
        setData(formattedData);
      }
    };

    reader.readAsBinaryString(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleFile(file);
  };

  useEffect(() => {
    console.log(fileLoaded);
  }, [fileLoaded]);

  return (
    <div className='flex flex-col gap-3' {...getRootProps()}>
      <h1>{fileLoaded ? 'Файл выбран.' : 'Загрузите Excel файл'}</h1>
      <label htmlFor={'excel_file_input'} className='p-3 bg-[--respect-purple-dark] text-center rounded-md cursor-pointer'>
        {fileLoaded ? 'Поменять' : 'Выбрать файл'}
      </label>
      <input id='excel_file_input' className='hidden' type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {isDragActive ? <p>Перетащите файлы</p> : null}
    </div>
  );
};

export default ExcelReader;