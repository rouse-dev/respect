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
    const page = selectedItem.selected + 1; 
    goToPage(page);
  };

  return (
   <div className="flex justify-center mt-4">
  <ReactPaginate
    previousLabel={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
    nextLabel={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>}
    breakLabel={'...'}
    pageCount={totalPages}
    marginPagesDisplayed={1} 
    pageRangeDisplayed={3} 
    onPageChange={handlePageClick}
    forcePage={currentPage - 1} 
    containerClassName={'flex items-center gap-2'}
    activeClassName={'bg-(--respect-purple-dark) text-white rounded-full'}
    disabledClassName={'opacity-50 cursor-not-allowed'}
    previousClassName={'w-10 h-10 flex items-center justify-center bg-gray-100  text-gray-600 rounded-full transition-colors '}
    nextClassName={'w-10 h-10 flex items-center justify-center bg-gray-100  text-gray-600 rounded-full transition-colors'}
    pageClassName={'w-10 h-10 flex items-center justify-cente text-white  border border-gray-300 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-full transition-colors '}
    pageLinkClassName={'w-full h-full inline-flex items-center justify-center'} 
    breakClassName={'px-4 py-2 text-gray-400'}
    breakLinkClassName={'text-gray-400'} 
  />
</div>
  );
};

export default Paginator;