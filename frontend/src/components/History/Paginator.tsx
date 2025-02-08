import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginatorInterface {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

const Paginator: React.FC<PaginatorInterface> = ({
  currentPage,
  totalPages,
  goToPage,
}) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    const page = selectedItem.selected + 1; // react-paginate использует нумерацию с нуля
    goToPage(page);
  };

  return (
    <div className="flex justify-center mt-4">
      <ReactPaginate
        previousLabel={'Назад'}
        nextLabel={'Вперёд'}
        breakLabel={'...'}
        pageCount={totalPages}
        marginPagesDisplayed={1} // Показать одну страницу с каждого края
        pageRangeDisplayed={3} // Показать три страницы вокруг текущей
        onPageChange={handlePageClick}
        forcePage={currentPage - 1} // react-paginate использует нумерацию с нуля
        containerClassName={'flex items-center gap-2'}
        activeClassName={'bg-gray-700 text-white rounded'}
        disabledClassName={'opacity-50 cursor-not-allowed'}
        previousClassName={'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded transition duration-200'}
        nextClassName={'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded transition duration-200'}
        pageClassName={'w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-black hover:bg-gray-100 rounded transition duration-200'}
        pageLinkClassName={'w-full h-full inline-flex items-center justify-center'} // Растягиваем ссылку на всю кнопку
        breakClassName={'px-4 py-2 text-gray-400'}
        breakLinkClassName={'text-black'} // Текст "..." будет черным
      />
    </div>
  );
};

export default Paginator;