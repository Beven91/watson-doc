/*******************************************************
 * 名称：资源加载基类
 * 日期：2016-10-28
 * 版本：0.0.1
 * 描述：提供加载器规范
 *******************************************************/
var Dante = require('dantes');

/**
 * 基类构造函数
 */
function DocCommonLoader() { }

/**
 * 根据传入参数加载文档资源
 * @param context 资源必要的参数
 * 
 * @returns files 文件路径数组
 */
DocCommonLoader.prototype.load = function () {
    throw new Error("请实现文件加载功能");
}

/**
 * 派生出一个加载器类
 * @param SubClass 子类
 */
DocCommonLoader.driver = function(SubClass){
  return  Dante.Base.extend(DocCommonLoader,SubClass);
}

module.exports = DocCommonLoader;