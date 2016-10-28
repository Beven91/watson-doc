/*******************************************************
 * 名称：文档制作入口
 * 日期：2016-10-28
 * 版本：0.0.1
 *******************************************************/
var dox = require('dox');
var fs = require('fs');
var path = require('path');
var ejsCompiler = require('./compiler/ejsCompiler.js');
var ncp = require('ncp').ncp;

/**
 * 文档构建器构造函数
 */
function Maker() { }

/**function 
 * 根据传入配置制作文档
 * @param settings 配置参数
 * 
 *  settings:{
 *     "loader":"module",
 *      "name":"xxModule",
 *      "out":"./out"
 *  }
 */
Maker.prototype.make = function (settings) {
    //加载要生成文档的资源
    var files = loader(settings);
    var context = { modules: [] };
    //获取所有文件对应的模块
    var moduleList = getAllModules(files);
    //遍历开始
    for (var i = 0, k = moduleList.length; i < k; i++) {
        makeFile(moduleList[i], settings);
    }
    //复制静态资源
    copyStatic(settings);
}

/**
 * 加载文档资源
 * @param context 加载上下文
 */
function loader(context) {
    switch (context.loader) {
        case 'module':
            return require('./loader/module.loader.js').load(context);
        default:
            return require('./loader/dir.loader.js').load(context);
    }
}

/**
 * 获取所有导航模块
 */
function getAllModules(files) {
    var moduleList = [];
    var mModule = null;
    //开始遍历所有文件
    for (var i = 0, k = files.length; i < k; i++) {
        mModule = getModule(files[i]);
        mModule.all = moduleList;
        moduleList.push(mModule);
    }
    return moduleList;
}

/**
 * 获取指定文件中的模块名称@module，如果获取不到则使用exports的constructor，否则使用filename
 */
function getModule(file) {
    var buf = new String(fs.readFileSync(file));
    var mContext = dox.parseComments(buf);
    var tag = mContext.filter(moduleFilter).shift();
    var name = tag ? tag.ctx.name : path.basename(file);
    var mModule = { name: name, items: mContext, originfile: file };
    return mModule;
}


/**
 * module 或者function过滤器
 */
function moduleFilter(m) {
    return m.ctx && (m.ctx.type == "module" || m.ctx.type == "function");
}

/**
 * 制作单个js文档
 * @param targetModule 模块数据
 * @param settings  制作配置文件
 */
function makeFile(targetModule, settings) {
    var file = path.resolve('./template/layout.ejs');
    var outDir = path.resolve(settings.out);
    var outfile = path.resolve(path.join(outDir, targetModule.name + '.html'));
    ejsCompiler.compile(file, targetModule, outfile);
    console.log('maked file:' + targetModule.originfile);
}

/**
 * 复制静态资源
 */
function copyStatic(settings) {
    var source = path.resolve('./template/static');
    var destination = path.resolve(settings.out);
    ncp(source, destination, function () {
        console.log("make all files success!");
    });
}

module.exports = new Maker();