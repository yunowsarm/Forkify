import { async } from 'regenerator-runtime';
import { AJAX} from './helper';
import { URL_API, RESULT_PER_PAGE, KEY } from './config';
export const state = {
  recipe: {},
  search_Recipes: {
    query: '',
    results: [],
    page: 1,
    result_Per_page: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    source_url: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    bookmarked: false,
  };
}
//解析fetch到的数据值
export const loadRecipe = async function (hash_Id) {
  try {
    const URL = `${URL_API}/${hash_Id}?key=${KEY}`;
    const data = await AJAX(URL); //data存储json格式数据
    //可以直接用state.recipe=data.data.recipe存入数据
    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   source_url: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cooking_time: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    //   bookmarked: false,
    // };
    // console.log(state.bookmarks);
    state.recipe= createRecipeObject(data);
    if (state.bookmarks.some((bookmark) => bookmark.id === hash_Id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.error('😎获取数据失败' + error);
    throw error;
  }
};
//https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<insert your key>
export const loadSerchResult = async function (query) {
  try {
    state.search_Recipes.query = query;
    const URL = `${URL_API}/?search=${query}&key=${KEY}`;
    try {
      const data = await AJAX(URL);
      state.search_Recipes.results = data.data.recipes.map((rec) => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          ...(rec.key && { key: rec.key }),
        };
      });
      //每当输入新的东西时，将页码归1
      state.search_Recipes.page = 1;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error('😢搜索失败');
    throw error;
  }
};
export const getSearchResultPage = function (page = state.search_Recipes.page) {
  state.search_Recipes.page = page;
  const start = (page - 1) * state.search_Recipes.result_Per_page;
  const end = page * state.search_Recipes.result_Per_page;
  return state.search_Recipes.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  state.recipe.bookmarked = true;
  state.bookmarks.push(recipe);
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.recipe.bookmarked = false;
  state.bookmarks.splice(index, 1);
  persistBookmarks();
};
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        const ingArr = ing[1].split(',').map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error('错误的格式，请使用正确的格式😉');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${URL_API}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
const init = (function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
})();

// export const trans = async function () {
//   try {
//     console.log(state.recipe);
//     let {
//       id,
//       title,
//       publisher,
//       source_url,
//       image,
//       servings,
//       cooking_time,
//       ingredients,
//     } = state.recipe;
//     // 引入crypto库用于MD5加密
//     const CryptoJS = require('crypto-js');
//     // 设置请求参数
//     const appid = '20240423002032506'; // appid
//     const key = 'AHJdtXsOEwwxkUweGU5g'; // 密钥
//     const salt = Math.random().toString().substring(2); // 随机码

//     const query = `${id},${title},${publisher},${source_url},${image},${servings},${ingredients},${cooking_time}`; // 要翻译的文本

//     // 拼接字符串1
//     const str1 = appid + query + salt + key;

//     // 计算MD5值作为签名
//     const sign = CryptoJS.MD5(str1).toString();

//     // 构建完整的URL
//     const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${query}&from=en&to=zh&appid=${appid}&salt=${salt}&sign=${sign}`;

//     // 使用CORS代理
//     const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//     const finalUrl = proxyUrl + url;

//     const res = await fetch(finalUrl);
//     if (!res.ok) throw new Error(`HTTP status ${res.status}`);
//     const data = await res.json();

//     console.log(data);

//     // 检查响应数据结构
//     if (data.trans_result && data.trans_result[0] && data.trans_result[0].dst) {
//       const { dst } = data.trans_result[0];
//       let parts = dst.split('，');
//       console.log(parts[5]);
//     } else {
//       console.error('Unexpected response data structure:', data);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
