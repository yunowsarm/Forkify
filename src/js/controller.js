import * as model from './model';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  let id = null;
  try {
    //获取浏览器中的hash值
    id = window.location.hash.slice(1);
    //hash为null的处理结果
    if (!id) return;
    //调用recipeView里的renderSpinner()方法，显示加载图
    recipeView.renderSpinner();
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

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSerchResult(query);
    console.log(model.state.search_Recipes.results)
    // resultsView.render(model.state.search_Recipes.results);
    resultsView.render(model.getSearchResultPage());
    paginationView.render(model.state.search_Recipes)
  } catch (error) {
    console.error(error);
  }
};
const controlPagination=function(goToPage){
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search_Recipes)
}
const init = (function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination)
})();
