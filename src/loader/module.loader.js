/*******************************************************
 * 名称：生成文档模块加载器
 * 日期：2016-10-28
 * 版本：0.0.1
 * 描述：以cmd规范方式加载module返回该模块需要生成的文档的文件列表
 *******************************************************/
var path  =require('path');
var Dante = require('dante');
var BaseLoader = require('./base.loader.js');

/**
 * 模块加载构造函数
 */
function DocModuleLoader() { }

//继承于基础加载器
BaseLoader.driver(DocModuleLoader);

/**
 * 加载指定模块需要生成文档的资源列表
 * @param context 配置参数  格式如下: {name:'module_name',ext:'.js'}
 */
DocModuleLoader.prototype.load = function (context) {
    var targetExports = require(context.name);
    var targetModule = this.findModuleByExports(targetExports);
    return this.searchModule(targetModule, [],context);
}

/**
 * 搜索指定模块中所有的子模块路径
 * @param targetModule module对象
 * @param files 文件接收容器
 * @param ext 允许的模块资源文件类型 默认 .js 可以填写正则表达式
 */
DocModuleLoader.prototype.searchModule = function (targetModule, files,ext) {
    var children = targetModule.children;
    var extReg = new RegExp(Dante.string.blankOf(ext,'.js'));
    var itemModule  =null;
    for(var i=0,k=children.length;i<k;i++){
        itemModule = children[i];
        var ext = path.extname(itemModule.filename);
        if(!extReg.test(ext)){
            continue;
        }
        files.push(itemModule.filename);
        if(itemModule.children.length>0){
            this.searchModule(itemModule,files,ext);
        }
    }
    return files;
}

/**
 * 在当前模块的子模块中查找指定exports对应的module
 * @param targetExports 目标exports对象
 */
DocModuleLoader.prototype.findModuleByExports = function (targetExports) {
    var currentModule = module;
    var finder = function (m) { return m.exports === targetExports; };
    return currentModule.children.filter(finder).shift();
}

//公布加载器
module.exports = new DocModuleLoader();