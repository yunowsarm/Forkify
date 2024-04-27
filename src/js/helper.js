import { URL_API } from './config';
import { TIMEOUT_SEC } from './config';
//加载超时函数
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`等待时间太长，请检查网络 ${s}s Timeout`));
      }, s * 1000);
    });
  };
  
//获取数据
export const getJSON = async function (URL) {
  try {
    const res =await Promise.race([fetch(URL),timeout(TIMEOUT_SEC)]);
    if (!res.ok) throw new Error(`${res.status} : ${data.message}`);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error
  }
};
