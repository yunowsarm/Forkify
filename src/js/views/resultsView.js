import View from './View';
import icons from 'url:../../img/icons.svg';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `我们找不到您要的食谱，请尝试另一个😎`;
  _success_Message = '';
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('')
  }
  _generateMarkupPreview(lists){
    return  `
    <li class="preview">
        <a class="preview__link" href="#${lists.id}">
          <figure class="preview__fig">
            <img src="${lists.image}" alt="${lists.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${lists.title}</h4>
            <p class="preview__publisher">${lists.publisher}</p>
          </div>
        </a>
      </li>
    `;
  }
}
export default new resultsView();
