##
使用 node(typescript) 开发代理。

## init
如何初始化？没有单纯的不依赖任何框架的 cli 吗？

## 构思
1. 本机的请求都转发到 localhost:6080     —— 这个目前由浏览器的插件转发
2. 应用对监听到的请求 => 发送指定服务器 => 获得响应
3. 收到的响应返回 

## 客户端
捕获请求=转发给指定服务器

## 服务端
转发请求=获取响应


## referee
- [rfc1928](https://tools.ietf.org/html/rfc1928)
- [rfc1928译文]https://www.singchia.com/2018/03/21/RFC1928-Socks-Protocol-Version-5/