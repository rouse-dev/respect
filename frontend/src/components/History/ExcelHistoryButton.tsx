import React from 'react';
import { exportDataWithExcel } from '../../service/server';
import { toast } from 'react-toastify';

// Функция для создания ссылки на скачивание файла
const createDownloadLink = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; // Устанавливаем имя файла
  document.body.appendChild(link);
  link.click(); // Инициируем клик для скачивания
  if (link.parentNode) {
    link.parentNode.removeChild(link); // Удаляем ссылку после скачивания
  }
  window.URL.revokeObjectURL(url);
};

const ExcelHistoryButton: React.FC<{ studentId: number; name: string }> = ({
  studentId,
  name,
}) => {
  const handleDownload = async (): Promise<void> => {
    try {
      const response = await exportDataWithExcel(studentId, name);

      // Создаем файловый объект из данных ответа
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Получаем имя файла из заголовка Content-Disposition
      let fileName = `${name}.xlsx`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes('filename=')) {
        fileName = contentDisposition.split('filename=')[1].split(';')[0].trim().replace(/"/g, '');
      }

      // Создаем ссылку для скачивания
      createDownloadLink(blob, fileName);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      toast.error('Произошла ошибка при скачивании файла. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <button className="download-button" onClick={handleDownload}>
      Скачать историю репутации
    </button>
  );
};

export default ExcelHistoryButton;