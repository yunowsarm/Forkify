import * as model from './model';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookMarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
// https://forkify-api.herokuapp.com/v2
//主页面相关
const controlRecipes = async function () {
  try {
    //获取浏览器中的hash值
    const id = window.location.hash.slice(1);
    //hash为null的处理结果
    if (!id) return;
    //调用recipeView里的renderSpinner()方法，显示加载图
    recipeView.renderSpinner();
    //调用resultsView里的update()方法，显示列表图
    resultsView.update(model.getSearchResultPage());
    //调用bookmarksView里的update()方法，显示收藏图
    bookmarksView.update(model.state.bookmarks);
    //由于model.loadRecipe是async函数所以返回的值是promise需要用await
    await model.loadRecipe(id);
    //调用recipeView里的render()方法，显示主菜单图
    recipeView.render(model.state.recipe);
    // await model.trans()
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};
//列表相关
const controlSearchResults = async function () {
  try {
    //显示加载页面
    resultsView.renderSpinner();
    //获取输入的值
    const query = searchView.getQuery();
    if (!query) return;
    //将对应的输入值在API中寻找参数
    await model.loadSerchResult(query);
    //默认从第一页开始显示列表
    resultsView.render(model.getSearchResultPage());
    //显示下方的翻页按钮
    paginationView.render(model.state.search_Recipes);
  } catch (error) {
    console.error(error);
  }
};
//翻页按钮相关，可以和列表集成到一块
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search_Recipes);
};
const controlServings = function (updateTo) {
  //更新页面
  model.updateServings(updateTo);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //添加或删除收藏
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }else{
    model.deleteBookmark(model.state.recipe.id)
  }
  //渲染页面
  bookmarksView.render(model.state.bookmarks);
  //更新页面
  recipeView.update(model.state.recipe);
}
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);

}
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    
  } catch (err) {
    console.error('😢', err);
    addRecipeView.renderError(err.message);
  }
}



//发布者-订阅者模式
const init = (function () {
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
})();
