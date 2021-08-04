# example

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).





## 项目内部优化-静态资源
##### icon
我们同一个类型的项目在不同的平台部署，所以会因为平台区分有部分差异。就会有很多项目的icon。单个引入太麻烦，所以我写了一个 vue-icon的组件，可以像antd的createFromIconfontCN一样使用，只用UI维护iconfont图表库即可。再也不用引入了。哈哈，解放双手。[vue-midou-icon](https://www.npmjs.com/package/vue-midou-icon)  
引入方式
```
import MdUi from 'vue-midou-icon'
const IconFont = MdUi.createFromIconfontCN({
  scriptUrl:[
    'your-iconfont-symbbol-url'
  ],
  // name可以不写 默认为 md-icon
  name: 'your-iconfont-component-name',
})
Vue.use(IconFont)
```
组件使用方式
```
<your-iconfont-component-name type="iconType" class="className">
</your-iconfont-component-name>
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db8b3fa2b2ec461cb3ac2d78a7d10714~tplv-k3u1fbpfcp-watermark.image)

##### images
图片需要压缩，[压缩地址](https://tinypng.com/)。可以根据图片的实际大小，多次压缩。   
用户一个弹框的背景图，ui设计出来的图片有3M，这个时候就可以多次压缩到1M左右上传图床。  
当图片比较小。就可以考虑放在本地。在webpack的配置中进行打包处理  
如果图片是gif动态图。可以考虑让ui逐帧截取后再做图片预加载。如何做预加载可以参考 [页面图片预加载与懒加载策略](https://juejin.cn/post/6844903760695656455#heading-2) 

##### fonts
对于字体可以考虑转换，我们的项目里有在线编辑图片，所以要加载很多ui字体。每个字体包在转换之前有17M。通过压缩转换字体，把otf转换成woff。就变成了5kb，不过字体会稍微有点点改变，如果对字体要求十分严格，可以考虑面的方式。[点击进入字体压缩地址](https://convertio.co/zh/)  
也可以通过外链的方式，试用[google的fonts](https://fonts.google.com/)。但是会因为外网访问不到。建议先下载字体包。具体如何使用可以参考 [Google Fonts 的介绍与使用](https://www.cnblogs.com/milly/archive/2013/05/10/google-fonts.html)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/997c4b0b750d41139b25ed85fa28fccb~tplv-k3u1fbpfcp-watermark.image)
##### css
项目在我接手前css的使用很混乱。项目公共css要在每个组件里都引入一遍，随着后期的项目迭代，这个文件夹就会越来越大。对于后期css的抽离和只打包使用过的className的方式不友好。css变量也没有规范统一和全局配置，后期使用需要在使用的地方再引入一遍，且不好做主题换肤。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45f1d5f57e1a44b1ac7baeb9f2317aca~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02c928303f624484b3d45cb3e6bf98fa~tplv-k3u1fbpfcp-watermark.image)

下面是我改造后的方式
1. 对于css变量全局使用,我使用了 [style-resources-loader](https://www.npmjs.com/package/style-resources-loader) 进行变量注入
```
{
    loader: 'style-resources-loader',
    options: {
      patterns: [
        path.resolve(__dirname, '../src/assets/css/variables/*.less'),
        path.resolve(__dirname, '../src/assets/css/mixins/*.less')
      ],
      injector: (source, resources) => {
        const combineAll = type => resources
          .filter(({ file }) => file.includes(type))
          .map(({ content }) => content)
          .join('')

        return combineAll('variables') + combineAll('mixins') + source
      }
    }
  }
```
2. 对于css文件我重新整理了一下，我分为下面几部分。然后把此文件在入口文件引入


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d7f50701a124b978012f77b1a04173b~tplv-k3u1fbpfcp-watermark.image)  
3. 对于原来写在这里的组件css，我把她们和各自的组件放在一起了

## 项目内部优化-代码
##### 整理目录文件
原来的目录结构的公共组件和页面业务组件没有分开，所以组件越来越多，且有路由直接加载components里的组件的现象。目录结构混乱。没有模块划分的概念。  
下面是我整理后的目录结构
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/393f81eca96c4434a545de963fc0de33~tplv-k3u1fbpfcp-watermark.image)
##### vuex模块抽离与plugin和全局loading
1. vuex-model-extend   类目dva的 dva-model-extend
2. vuex-plugin-loading 类目dva的 action的loading中间件
3. vuex-base-model     列表的请求和筛选，查询封装
4. vuex-auto-register  自动注册model

这个功能我思考过用mixins编写此功能。但是需要添加配置，所以mixins无法满足需求。且请求数据放在vuex里，我也感觉更合理一点

vuex-base-model返回的数据结构为
```javascript
{
    namespaced:true,
    state:()=>{
        tableData,
        
    }
}
```


##### 自定义指令 
##### 组件自动注册
##### 通过performance面板调试，优化页面加载速度
1. 代码分割，组件动态加载模块
2. debounce和throttle 使用


## webpack升级
#### 先让项目运行起来：vue环境编译配置和css、less、font、image资源打包分配
1. babel
2. css less
3. font
#### 环境区分
1. hash 和 content hash
2. 全局变量
#### 开发体验
1. hmr
2. hot reload
3. 代理
#### 打包速度
1. resolve
2. thread-loader
3. HardSourceWebpackPlugin
4. cache-loader
#### 打包bundle体积
1. 按需引入
2. splitChunks
3. lodash moment抽离
4. externals
3. 分析analyzer
#### 缓存
1. runtimeChunk
2. webpackChunkName
## 结果
1. 打包体积
2. 首页加载速度
3. 开发体验
4. 打包速度
## 求点赞
此优化历时半年，边开发边做的，个人感觉还有很多不够完善的地方。希望大家看到了可以不吝赐教，感激不尽。。如果觉得不错，求点赞，谢谢各位大佬！！！！



列表请求
### config

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| getList | 配置如何从接口响应中得到数据列表和分页器 | (response) => ({ tableData: [], total: {}}) | - |
| originPagination | 初始分页器数据 | (response) => ({ tableData: [], total: {}}) | - |

### set
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fetchMethod | 带查询参数的数据列表请求方法 | (paylaod) => Response | - |

### 方法
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| sizeChange | pageSize 改变时会触发 - |
| currentChange | currentPage 改变时会触发 - |
| onPrevClick | 用户点击上一页按钮改变当前页后触发 - |
| onNextClick | 用户点击下一页按钮改变当前页后触发 - |
| setFilter | 点击查询按钮 - |
| query | 请求数据初始化时 - |