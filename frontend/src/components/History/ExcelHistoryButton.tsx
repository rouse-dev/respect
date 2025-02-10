import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const createDownloadLink = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  if (link.parentNode) {
    link.parentNode.removeChild(link);
  }
  window.URL.revokeObjectURL(url);
};

const exportDataWithExcel = async (studentId: number) => {
  try {
    const response = await axios.get(`/api/students/${studentId}/history/excel`, {
      responseType: 'blob', // Указываем, что ожидаем бинарные данные
    });
    return response;
  } catch (error) {
    console.error('Ошибка при получении файла:', error);
    throw error;
  }
};

const ExcelHistoryButton: React.FC<{ studentId: number }> = ({
  studentId,
}) => {
  const handleDownload = async (): Promise<void> => {
    try {
      const response = await exportDataWithExcel(studentId);

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      let fileName = `${name}.xlsx`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes('filename=')) {
        fileName = contentDisposition.split('filename=')[1].split(';')[0].trim().replace(/"/g, '');
      }

      createDownloadLink(blob, fileName);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      toast.error('Произошла ошибка при скачивании файла. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <button className="download-button" onClick={handleDownload}>
      Экспортировать историю
    </button>
  );
};

export default ExcelHistoryButton;