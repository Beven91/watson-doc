/*******************************************************
 * 名称：文档制作入口
 * 日期：2016-10-28
 * 版本：0.0.1
 *******************************************************/
var dox = require('dox');
var fs = require('fs');
var ncp = require('ncp').ncp;
var path = require('path');
var Dante = require('dante');
var ejsCompiler = require('./compiler/ejsCompiler.js');

var defauls = {
    loader: 'module', //文件加载方式
    target: '', //如果loader是module则设置nodejs 模块名称,如果Loader为dir则为目录路径
    ext: '.js$', //过略文件，默认为.js
    out: './docs', //文档输出目录，
    pgk: {
        version: '', //文档版本 在loader为module时自动从package.json中取
        title: '', //文档标题 在loader为module时自动从package.json中取
        repository: null
    }
}

/**
 * 文档构建器构造函数
 */
function Maker() {}

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
Maker.prototype.make = function(settings) {
    //参数默认处理
    settings = Dante.fn.doAssign({}, defauls, settings);
    //加载要生成文档的资源
    var files = loader(settings);
    var context = {
        modules: []
    };
    //获取所有文件对应的模块
    var moduleList = getAllModules(files, settings);
    //遍历开始
    for (var i = 0, k = moduleList.length; i < k; i++) {
        makeDocFile(moduleList[i], settings);
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
function getAllModules(files, settings) {
    var moduleList = [];
    var mModule = null;
    //开始遍历所有文件
    for (var i = 0, k = files.length; i < k; i++) {
        mModule = getModule(files[i], settings);
        mModule.all = moduleList;
        moduleList.push(mModule);
    }
    return moduleList;
}

/**
 * 获取指定文件中的模块名称@module，如果获取不到则使用exports的constructor，否则使用filename
 * @param file 文件路径
 * @param settings 配置数据
 */
function getModule(file, settings) {
    var buf = new String(fs.readFileSync(file));
    var mContext = dox.parseComments(buf);
    var tag = mContext.filter(moduleFilter).shift();
    var name = tag ? tag.ctx.name : dynamicModuleName(mContext, file);
    var declar = mContext.filter(declarationFilter).shift();
    var mModule = {
        pgk: settings.pgk,
        name: name,
        items: mContext,
        originfile: file,
        sourcename: path.basename(file),
        filebasename: path.basename(file).replace(path.extname(file), ""),
        relativePath: path.relative(settings.pgk.dir, file),
        fullCode: new String(fs.readFileSync(file, null)).replace(/\ufeff/g, ''),
        ctx: {
            name: name,
            description: declar ? declar.description.full : ""
        }
    };
    return mModule;
}


/**
 * module 或者function过滤器
 */
function moduleFilter(m) {
    return m.ctx && (m.ctx.type == "module" || (m.ctx.type == "constructor" && m.ctx.name != ""));
}

/**
 * 动态推测模块的名称
 */
function dynamicModuleName(items, file) {
    var m = items.filter(function(item) {
        return item.ctx && item.ctx.type == "method";
    }).shift();
    var name = m ? (m.ctx.receiver || m.ctx.constructor) : path.basename(file);
    if (Dante.type.isFunction(name)) {
        name = path.basename(file);
    }
    return name;
}

/**
 * declaration 过滤器
 */
function declarationFilter(m) {
    return m.ctx && (m.ctx.type == 'declaration');
}

/**
 * 制作单个js文档html文件
 * @param targetModule 模块数据
 * @param settings  制作配置文件
 */
function makeDocFile(targetModule, settings) {
    var file = path.join(__dirname, '../template/layout.ejs');
    var outDir = path.resolve(settings.out);
    var outfile = path.resolve(path.join(outDir, targetModule.filebasename + '.html'));
    ejsCompiler.compile(file, targetModule, outfile);
    console.log('maked doc file     >>      ' + targetModule.relativePath);
    makeSourceFile(targetModule, settings);
}

/**
 * 制作单个js源代码文件
 * @param targetModule 模块数据
 * @param settings  制作配置文件
 */
function makeSourceFile(targetModule, settings) {
    var file = path.join(__dirname, '../template/source.ejs');
    var outDir = path.resolve(settings.out);
    var outfile = path.resolve(path.join(outDir, 'source', targetModule.sourcename + '.html'));
    ejsCompiler.compile(file, targetModule, outfile);
    console.log('maked source file  >>      ' + targetModule.relativePath);
}

/**
 * 复制静态资源
 */
function copyStatic(settings) {
    var source = path.join(__dirname, '../template/static');
    var destination = path.resolve(settings.out);
    ncp(source, destination, function() {
        console.log("make all files success!");
    });
}

module.exports = new Maker();