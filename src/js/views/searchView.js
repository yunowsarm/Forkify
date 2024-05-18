import * as model from '../model';

class SearchView {
  _parentElement = document.querySelector('.search');
  
  

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); // 调用 preventDefault 方法
      handler();
    });
  }
}

export default new SearchView();
