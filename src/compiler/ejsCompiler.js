/*******************************************************
 * 名称：ejs模板编译工具
 * 日期：2016-10-28
 * 版本：0.0.1
 * 描述：编译指定模板内容
 *******************************************************/
var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

/**
 * ejs 编译工具
 */
function EJSCompiler() { }

/**
 * 编译指定文件输出到指定目录
 * @param file 视图路径
 * @param data 视图数据
 * @param outfile
 */
EJSCompiler.prototype.compile = function (file, data, outfile) {
    var buf = read(file);
    data = data || {};
    data.filename = path.resolve(file);
    var htmls = ejs.render(buf, data);
    ensureDir(path.dirname(outfile));
    fs.writeFileSync(outfile, htmls, { encoding: 'utf8' });
}

/**
 * 编译指定文件
 * @param file 视图路径
 * @param data 视图数据
 * @returns String 
 */
EJSCompiler.prototype.render = function (file, data) {
    var buf = read(file);
    data = data || {};
    data.filename = path.resolve(file);
    return ejs.render(buf, data);
}

/**
 * 确保目录存在
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

/**
 * 读取指定文件
 * @param file
 * @returns String
 */
function read(file) {
    return new String(fs.readFileSync(file, { encoding: 'utf8' }));
}

module.exports = new EJSCompiler();