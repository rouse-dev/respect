import { exportHistoryExcel } from '../../service/server';

interface DownloadReputationHistoryButtonProps {
  studentId: number;
  name: string
}

const ExcelHistoryButton = ({ studentId, name }: DownloadReputationHistoryButtonProps) => {
  const handleDownload = async () => {
    try {
      const response = await exportHistoryExcel(studentId)
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}_история_репутации.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    }
  };

  return (
    <button onClick={handleDownload}>
      Скачать историю репутации
    </button>
  );
};

export default ExcelHistoryButton;