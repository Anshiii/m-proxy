/* 用户的 target 模拟 */
const net = require("net");

class MProxy {
  constructor(options) {
    this.port = options.port;
  }

  run() {
    const server = net.createServer(socket => {
      socket.on("data", buff => {
        console.log("来自 p-server 的数据", buff.toString());
        /* 从这里拿到数据，并响应。 */
        socket.write("我已经收到了，这是你的响应");
      });

      socket.on("end", () => {
        console.log("t-server 被断开连接");
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
}

new MProxy({ port: 7777 }).run();
