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
        console.log("这是P-CLIENT收到的data", buff.toString());

        /* 从这里拿到数据，向p-server发起请求 */
        const client = net.createConnection(
          {
            host: "localhost",
            port: 6090
          },
          () => {
            /* 建立和服务的连接 */
            console.log("已经和 p-server 建立了链接");
            client.write(buff.toString(), () => {
              console.log("客户端已发送");
            });
          }
        );
        client.on("data", buff => {
          /* 来自 p-server 的响应,返回给 t-client */
          socket.write(buff.toString());
        });
      });

      socket.on("end", () => {
        console.log("p-client 被断开连接");
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
