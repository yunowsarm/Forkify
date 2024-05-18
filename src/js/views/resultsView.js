import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
 
    _parentElement = document.querySelector('.results');
    _errorMessage = `我们找不到您要的食谱，请尝试另一个😎`;
    _success_Message = '';
  

    _generateMarkup() {
      return this._data.map(result => previewView.render(result, false)).join('');
    }
}

export default new ResultsView();
