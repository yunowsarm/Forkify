import { async } from 'regenerator-runtime';
import { getJSON } from './helper';
import { URL_API ,RESULT_PER_PAGE,KEY} from './config';
export const state = {
  recipe: {},
  search_Recipes: {
    query: '',
    results: [],
    page:1,
    result_Per_page:RESULT_PER_PAGE
  },
};
//解析fetch到的数据值
export const loadRecipe = async function (hash_Id) {
  try {
    const URL = `${URL_API}/${hash_Id}?key=${KEY}`;
    const data = await getJSON(URL); //data存储json格式数据
    //可以直接用state.recipe=data.data.recipe存入数据
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (error) {
    console.error('😎获取数据失败' + error);
    throw error;
  }
};
export const loadSerchResult = async function (query) {
  try {
    state.query = query;
    const URL = `${URL_API}/?search=${query}&key=${KEY}`;
    const data = await getJSON(URL);
    //可以直接用state.search_Recipes.results=data.data.recipes存入数据
    state.search_Recipes.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (error) {
    console.error("😢搜索失败")
    throw error
  }
};
export const getSearchResultPage=function(page=state.search_Recipes.page){
  state.search_Recipes.page=page
  const start=(page-1)* state.search_Recipes.result_Per_page
  const end=page * state.search_Recipes.result_Per_page
  return state.search_Recipes.results.slice(start,end)
}
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
