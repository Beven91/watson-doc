/*******************************************************
 * 名称：生成文档模块加载器
 * 日期：2016-10-28
 * 版本：0.0.1
 * 描述：以cmd规范方式加载module返回该模块需要生成的文档的文件列表
 *******************************************************/
var path = require('path');
var fs = require('fs');
var Dante = require('dante');
var BaseLoader = require('./base.loader.js');

/**
 * 模块加载构造函数
 */
function DocModuleLoader() {}

//继承于基础加载器
BaseLoader.driver(DocModuleLoader);

/**
 * 加载指定模块需要生成文档的资源列表
 * @param context 配置参数  格式如下: {target:'module_name',ext:'.js'}
 */
DocModuleLoader.prototype.load = function(context) {
    this.settings = context;
    var targetModule = this.getModule(context.target);
    var files = [];
    if (this.isDoc(targetModule.filename)) {
        files.push(targetModule.filename);
    }
    //设置pgk
    context.pgk = this.package(context.target);
    return this.searchModule(targetModule, files, context.ext, context.pgk.dir + '\\');
}

/**
 * 搜索指定模块中所有的子模块路径
 * @param targetModule module对象
 * @param files 文件接收容器
 * @param ext 允许的模块资源文件类型 默认 .js 可以填写正则表达式
 * @param dir 当前模块的根目录
 */
DocModuleLoader.prototype.searchModule = function(targetModule, files, ext, dir) {
    var children = targetModule.children;
    var itemModule = null;
    var filename = null;
    var moduleDirNM = path.join(dir, 'node_modules');
    for (var i = 0, k = children.length; i < k; i++) {
        itemModule = children[i];
        filename = itemModule.filename;
        if (filename.indexOf(moduleDirNM) > -1 || filename.indexOf(dir) < 0 || !this.isDocByExt(ext, filename)) {
            continue;
        }
        files.push(filename);
        if (itemModule.children.length > 0) {
            this.searchModule(itemModule, files, ext, dir);
        }
    }
    return files;
}

/**
 * 根据当前loader配置判断指定文件是否能生成文档
 */
DocModuleLoader.prototype.isDoc = function(filename) {
    return this.isDocByExt(this.settings.ext, filename);
}

/**
 * 判断指定文件是否能生成文档
 */
DocModuleLoader.prototype.isDocByExt = function(ext, filename) {
    var extReg = new RegExp(Dante.string.blankOf(ext, '.js$'));
    var extname = path.extname(filename);
    return extReg.test(extname);
}

/**
 * 在当前模块的子模块中查找指定exports对应的module
 * @param targetExports 目标exports对象
 */
DocModuleLoader.prototype.findModuleByExports = function(targetExports) {
    var currentModule = module;
    var finder = function(m) {
        return m.exports === targetExports;
    };
    return currentModule.children.filter(finder).shift();
}

/**
 * 获取指定nodejs的module 而不是require返回的exports
 * @param name 模块根路径或者当前node_modules下的模块名称或者全局模块
 */
DocModuleLoader.prototype.getModule = function(name) {
    var targetExports = require(name);
    return this.findModuleByExports(targetExports);
}

/**
 * 读取指定模块的package.json
 * @param name 模块根路径或者当前node_modules下的模块名称或者全局模块
 */
DocModuleLoader.prototype.package = function(name) {
    var targetModule = this.getModule(name);
    var dir = path.dirname(targetModule.filename);
    var pgkfile = path.join(name, 'package.json');
    var pgk = {
        name: path.basename(dir),
        version: '',
        repository: '',
        dir: dir
    }
    if (!fs.existsSync(pgkfile)) {
        pgkfile = getPgkfile(path.join(dir, 'package.json'));
    }
    if (fs.existsSync(pgkfile)) {
        pgk = require(pgkfile);
        pgk.dir = path.dirname(pgkfile);
    }
    return pgk;
}

function getPgkfile(filename) {
    filename = filename.replace(/\//g, '\\');
    var pname = null;
    var seg = null;
    while (!fs.existsSync(filename)) {
        pname = path.basename(filename);
        if (pname == "node_modules") {
            break;
        }
        seg = (path.dirname(filename)).split('\\');
        if (seg.length <= 1) {
            break;
        }
        seg.pop();
        filename = path.join(seg.join("\\"), "package.json");
    }
    return filename;
}

//公布加载器
module.exports = new DocModuleLoader();