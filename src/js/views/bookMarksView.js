import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
 
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = `还没有收藏食谱，快去收藏吧😎`;
    _success_Message = '';
  

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
  }
  addHandlerRender(handler){
    window.addEventListener('load',handler);
  }
}

export default new ResultsView();
