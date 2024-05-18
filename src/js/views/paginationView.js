import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {

  _parentElement = document.querySelector('.pagination');
  
  _getButton_next(currect_Page) {
    return `
      <button data-goto="${currect_Page}" class="btn--inline pagination__btn--next">
        <span>第${currect_Page}页</span>
        <svg class="search__icon">
          <use href="${icons}.svg#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  _getButton_prev(currect_Page) {
    return `
      <button data-goto="${currect_Page}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}.svg#icon-arrow-left"></use>
        </svg>
        <span>第${currect_Page}页</span>
      </button>
    `;
  }

  _generateMarkup() {
    const currect_Page = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.result_Per_page);

    if (currect_Page === 1 && numPages === 1) return '';
    if (currect_Page === 1 && currect_Page < numPages) return this._getButton_next(currect_Page + 1);
    if (currect_Page === numPages) return this._getButton_prev(currect_Page - 1);
    if (currect_Page !== 1 && currect_Page < numPages) return `${this._getButton_prev(currect_Page - 1)}${this._getButton_next(currect_Page + 1)}`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
