/*******************************************************
 * 名称：生成文档模块加载器
 * 日期：2016-10-28
 * 版本：0.0.1
 * 描述：以cmd规范方式加载module返回该模块需要生成的文档的文件列表
 *******************************************************/
var path = require('path');
var Dante = require('dantes');
var BaseLoader = require('./base.loader.js');

/**
 * 模块加载构造函数
 */
function DocDirLoader() {}

//继承于基础加载器
BaseLoader.driver(DocDirLoader);

/**
 * 加载指定模块需要生成文档的资源列表
 * @param context 配置参数  格式如下: {target:'/ss/s',ext:'.js'}
 */
DocDirLoader.prototype.load = function(context) {

}

//公布加载器
module.exports = new DocDirLoader();