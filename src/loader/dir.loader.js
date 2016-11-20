/*******************************************************
 * 名称：生成文档模块加载器
 * 日期：2016-10-28
 * 版本：0.0.1
 * 描述：以cmd规范方式加载module返回该模块需要生成的文档的文件列表
 *******************************************************/
var path = require('path');
var fs = require('fs');
var BaseLoader = require('./base.loader.js');

/**
 * 目录加载构造函数
 * @param settings 配置参数  格式如下: {target:'/ss/s',ext:'.js'}
 */
function DocDirLoader(settings) {
    this.settings = settings;
}

//继承于基础加载器
BaseLoader.driver(DocDirLoader);

/**
 * 加载指定模块需要生成文档的资源列表
 * 
 */
DocDirLoader.prototype.load = function() {
    var context = this.settings;
    var dir = context.target;
    var files = [];
    context.exclude.push(path.resolve(context.out));
    //设置pgk
    context.pgk = this.package(context.target);
    return this.searchDir(dir, files, path.join(context.pgk.dir, '/'));
}

/**
 * 搜索指定目录下所有js文件
 * @param dir 目录路径
 * @param files 文件接收容器
 * @param rootDir 当前模块的根目录
 */
DocDirLoader.prototype.searchDir = function(dir, files, rootDir) {
    var fileList = fs.readdirSync(dir);
    var itemModule = null;
    var filename = null;
    var moduleDirNM = path.join(dir, 'node_modules');
    for (var i = 0, k = fileList.length; i < k; i++) {
        filename = path.join(dir, fileList[i]);
        itemModule = fs.lstatSync(filename);
        if (filename.indexOf(moduleDirNM) > -1 || filename.indexOf(rootDir) < 0 || this.isExclude(filename)) {
            continue;
        }
        if (itemModule.isDirectory()) {
            this.searchDir(filename, files, rootDir);
        } else if (this.isDoc(filename)) {
            files.push(filename);
        }
    }
    return files;
}

/**
 * 获取当前目录所在工程的package.json
 */
DocDirLoader.prototype.package = function(dir) {
    var pgkfile = path.join(dir, 'package.json');
    var pgk = {
        name: path.basename(dir),
        version: '',
        repository: '',
        dir: dir
    }
    if (!fs.existsSync(pgkfile)) {
        pgkfile = this.searchPgkfile(path.join(dir, 'package.json'));
    }
    if (fs.existsSync(pgkfile)) {
        pgk = require(pgkfile);
        pgk.dir = path.dirname(pgkfile);
    }
    return pgk;
}

//公布加载器
module.exports = DocDirLoader;