const net = require("net");

function getMethodAndHost(buff) {
  console.log;
  let UNDERLINE = 0x5f;
  COLON = 0x3a;

  let method, ip, port, relData; // host 包括 port
  let line0 = buff.indexOf(UNDERLINE);
  let line1 = buff.indexOf(UNDERLINE, line0 + 1);
  let colon0 = buff.indexOf(COLON, line1);
  let line2 = buff.indexOf(UNDERLINE, line1 + 1);

  method = buff.slice(line0 + 1, line1);
  if (colon0 > line2) {
    /* 没有端口号 */
    ip = buff.slice(line1 + 1, line2);
    port = Buffer.from("80");
  } else {
    ip = buff.slice(line1 + 1, colon0);
    port = buff.slice(colon0 + 1, line2);
  }
  relData = buff.slice(line2 + 1);

  console.log(`
  ${buff.toString()}
  p-server 解析数据
  method:${method.toString()}, 
  ip:${ip.toString()},
  port:${port.toString() - 0}`);
  return { method, ip, port, relData };
}
module.exports = class MProxy {
  constructor(options) {
    this.port = options.port;
  }

  run() {
    const server = net.createServer(socket => {
      /* p-client and p-server 的socket */
      socket.on("data", buff => {
        const methodAndHost = getMethodAndHost(buff);

        /* 如果是 connect 则；如果是其他方法 get  */

        /* 从这里拿到数据，向t-server发起请求 */
        const client = net.createConnection(
          {
            host: methodAndHost.ip.toString(),
            port: methodAndHost.port.toString() - 0
          },
          () => {
            client.write(methodAndHost.relData, () => {
              console.log(
                `向目标服务器${methodAndHost.ip.toString()}:${methodAndHost.port.toString() -
                  0}发送数据：${methodAndHost.relData.toString()}`
              );
            });

            client.on("data", res => {
              /* 来自 t-server 的响应,返回给 p-client */
              console.log(`
              来自t-server的响应: ${res.slice(0,100).toString()}`);
              socket.write(res);
            });

            client.on("error", err => {
              console.log(err);
            });
          }
        );
      });

      socket.on("end", () => {
        console.log("p-server 被断开连接");
      });
      socket.on("error", err => {
        console.log(err);
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
