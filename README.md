## watson

### 一、简介

基于[dox](https://github.com/tj/dox)的文档生成工具，用于生成一个nodejs结构项目。


### 二、安装

    npm install watson --save-dev -g
    
     
### 三、用例
	
    全局模式：
            watson 

    本地使用：

            var watson = require('watson');

            watson.make({
                loader: 'module', //文件加载方式 目前支持 module 或者 dir
                target: '', //如果loader是module则设置nodejs 模块名称,如果Loader为dir则为目录路径
                ext: '.js$', //过滤文件，默认为.js
                out: './docs', //文档输出目录，
                //pgk 默认读取package.json
                pgk: {
                    version: '', //文档版本 在loader为module时自动从package.json中取
                    title: '', //文档标题 在loader为module时自动从package.json中取
                    repository: null
                }
            });

    
      
### 四、参数解释

* **loader** 文件加载方式 目前支持 module 或者 dir
* **target** 如果loader是module则设置nodejs 模块名称,如果Loader为dir则为目录路径
* **ext**    过滤文件，默认为.js
* **out**    文档输出目录，例如:./docs
* **pgk**    默认读取package.json 具体参见package.json规范
    * **pgk.version** 文档版本
    * **pgk.title** 文档标题
    * **pgk.repository** 版本库

     

### 五、开源许可
基于 [MIT License](http://zh.wikipedia.org/wiki/MIT_License) 开源，使用代码只需说明来源，或者引用 [license.txt](https://github.com/sofish/typo.css/blob/master/license.txt) 即可。