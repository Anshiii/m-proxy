const net = require("net");
module.exports = class MProxy {
  constructor(options) {
    this.port = options.port;
  }

  run() {
    /* 创建一个 TCP 服务器 */
    const server = net.createServer(socket => {
      /* socket 是双工流 - 可读可写，也是一个 eventEmitter */
      console.log(
        `socket 地址：${socket.remoteAddress}:${socket.remotePort} size:${
          socket.bufferSize
        }`
      );

      socket.on("data", buff => {
        /* data 是用户的真实请求数据 */
        console.log("这是我收到的data", buff.toString());
      });

      /* 监听到 user 发送了 socket
      转发给 客户端  */
      /*  net.createConnection(7777, "localhost", socket => {
        console.log("和本机的 7777 进行链接？", socket);
      }); */

      socket.on("end", () => {
        console.log("客户端已断开连接");
      });
    });

    // 返回一个 tcp/IPC 服务器
    //开始监听，返回实例
    server.listen(
      {
        host: "localhost",
        port: this.port,
        exclusive: true //独占端口
      },
      () => {
        console.log(`开始监听端口${this.port}`);
      }
    );
  }
};
