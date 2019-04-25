
const MProxy = require('../src/index')
/* use mProxy */
const options = {
    port:6080
}

/* TODO options 应该使用 json 文件传入 */
const mProxy = new MProxy(options)

/* 后 本机所有的接口都 代理啦？  把本机的接口都 */
mProxy.run()