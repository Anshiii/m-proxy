const MProxy = require("../src/client");
/* use mProxy */
const options = {
  port: 6080
};

/* TODO options 应该使用 json 文件传入 */
const mProxy = new MProxy(options);

mProxy.run();
