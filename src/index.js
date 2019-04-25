const http = require("http");

module.exports = class MProxy {
  constructor(options) {
    this.port = options.port;
  }

  run() {
    const server = http.createServer((res, rep) => {
      console.log(res, rep);
    }); // 返回一个 http.Server 的实例
    server.listen(
      {
        host: "localhost",
        port: this.port,
        exclusive: true //独占端口
      },
      () => {
        console.log(`开始监听端口${this.port}`);
      }
    ); //开始监听，返回实例
    return this;
  }
};
