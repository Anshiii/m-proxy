const net = require("net");
module.exports = class MProxy {
  constructor(options) {
    this.port = options.port;
  }

  run() {
    const server = net.createServer(socket => {
      socket.on("data", buff => {
        console.log("来自 p-client 的数据", buff.toString());
        /* 从这里拿到数据，向t-server发起请求 */
        const client = net.createConnection(
          {
            host: "localhost",
            port: 7777
          },
          () => {
            /* 建立和t-server的连接 */
            console.log("已经和服务端建立了链接");

            client.write(buff.toString(), () => {
              console.log("来自client的数据已发送至target");
            });

            client.on("data", buff => {
              /* 来自 t-server 的响应,返回给 p-client */
              socket.write(buff.toString());
            });
          }
        );
      });

      socket.on("end", () => {
        console.log("p-server 被断开连接");
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
