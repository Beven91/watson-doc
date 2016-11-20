/*******************************************************
 * 名称：资源加载基类
 * 日期：2016-10-28
 * 版本：0.0.1
 * 描述：提供加载器规范
 *******************************************************/
var path = require('path');
var fs = require('fs');

var Dante = require('dantejs');

/**
 * 基类构造函数
 */
function DocCommonLoader() {}

/**
 * 根据传入参数加载文档资源
 * @param context 资源必要的参数
 * 
 * @returns files 文件路径数组
 */
DocCommonLoader.prototype.load = function() {
    throw new Error("请实现文件加载功能");
}

/**
 * 派生出一个加载器类
 * @param SubClass 子类
 */
DocCommonLoader.driver = function(SubClass) {
    return Dante.Base.extend(SubClass, DocCommonLoader);
}

/**
 * 根据指定文件所在目录向上寻找package.json
 */
DocCommonLoader.prototype.searchPgkfile = function(filename) {
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

/**
 * 判断指定文件是否能生成文档
 */
DocCommonLoader.prototype.isDocByExt = function(ext, filename) {
    var extReg = new RegExp(Dante.String.blankOf(ext, '.js$'));
    var extname = path.extname(filename);
    return extReg.test(extname);
}

/**
 * 根据当前loader配置判断指定文件是否能生成文档
 */
DocCommonLoader.prototype.isDoc = function(filename) {
    return this.isDocByExt(this.settings.ext, filename);
}

/**
 * 判断是否为排除目录
 * @param 
 * @param dir
 */
DocCommonLoader.prototype.isExclude = function(dir) {
    var excludes = '(' + (this.settings.exclude || []).join('|').replace(/\//g, "\\\\") + ')';
    dir = dir.replace(/\//g, "\\");
    dir = Dante.String.ensureEndsWith(dir, "\\");
    var extReg = new RegExp(Dante.String.blankOf(excludes, ''));
    return extReg.test(dir);
}

module.exports = DocCommonLoader;