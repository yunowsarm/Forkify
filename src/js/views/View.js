import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  _clear() {
    this._parentElement.innerHTML = '';
  }
  //通过render实现显示主页
  render(data,render=true) {
    if (!data || (Array.isArray(data) && data.length === 0)){
      return this.renderError();
    }
    this._data = data;
    const markup = this._generateMarkup();
    if(render==false) return markup
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data){
    if (!data || (Array.isArray(data) && data.length === 0)){
      return this.renderError();
    }
      
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    
    newElements.forEach((newEl,i)=>{
      const curEl=curElements[i]
      if(!newEl.isEqualNode(curEl)&&newEl.firstChild?.nodeValue.trim()!==''){
        
        curEl.textContent=newEl.textContent
      }
      if(!newEl.isEqualNode(curEl)){
        Array.from(newEl.attributes).forEach(attr=>{
          curEl.setAttribute(attr.name,attr.value)
        })
      }
    })
  }
  //通过renderSpinner实现显示加载图
  renderSpinner() {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(error_Message = this._errorMessage) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}.svg#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${error_Message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(success_Message = this._success_Message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${success_Message}</p>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
