##
使用 node(typescript) 开发代理。

## init
如何初始化？没有单纯的不依赖任何框架的 cli 吗？

## 构思
1. 本机的请求都转发到 localhost:6080     —— 这个目前由浏览器的插件转发
2. 应用对监听到的请求 => 发送指定服务器 => 获得响应
3. 收到的响应返回 

## referee
[rfc1928](https://tools.ietf.org/html/rfc1928)