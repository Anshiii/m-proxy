const net = require("net");
// const Buffer = require("buffer");
// const { HTTPParser } = internalBingding("http_parser_llhttp");

function getMethodAndHost(buff) {
  let LF = 0x0a,
    CR = 0x0d,
    SPACE = 0x20,
    UNDERLINE = 0x5f;
  let UNDERLINEBuf = Buffer.from([UNDERLINE]);
  let crlfBuf = Buffer.from([CR, LF]);
  let hostBuf = Buffer.from("Host: ", "utf8");
  let bodyIntervallBuf = Buffer.from([CR, LF, CR, LF]);

  let method, host; // host 包括 port
  let methodIdx = buff.indexOf(SPACE);
  method = buff.slice(0, methodIdx);

  let hostStart = buff.indexOf(hostBuf);
  let hostEnd = buff.indexOf(crlfBuf, hostStart);

  host = buff.slice(hostStart + hostBuf.length, hostEnd);

  console.log(`
  p-client 解析的数据
  method:${method.toString()}, 
  host:${host.toString()}`);
  return Buffer.concat(
    [UNDERLINEBuf, method, UNDERLINEBuf, host, UNDERLINEBuf],
    method.length + host.length + 3
  );
}
module.exports = class MProxy {
  constructor(options) {
    this.port = options.port;
  }

  run() {
    /* 创建一个 TCP 服务器 */
    const server = net.createServer(socket => {
      /* socket  user 与 p-client 的 socket */
      console.log(
        `当前 socket 地址：${socket.remoteAddress}:${socket.remotePort} size:${
          socket.bufferSize
        }`
      );

      socket.on("data", buff => {
        console.log("P-CLIENT收到", buff.toString());

        /* data 是用户的真实请求数据 @Q 为什么这里输出刚好是一个 http 请求
        // 把 字符串变成数据 */
        const methodAndHost = getMethodAndHost(buff);
        const dataPackage = Buffer.concat(
          [methodAndHost, buff],
          methodAndHost.length + buff.length
        );

        /* 从这里拿到数据，向p-server发起请求 */
        const client = net.createConnection(
          {
            host: "localhost",
            port: 6090
          },
          () => {
            /* 建立和服务的连接 */
            console.log("已经和 p-server 建立了链接");
            client.write(dataPackage, () => {
              console.log("p-client已发送数据", dataPackage.toString());
            });
          }
        );

        client.on("data", buff => {
          /* 来自 p-server 的响应,返回给 t-client */
          console.log(`
              来自p-server的响应: ${buff.toString()}`);
          socket.write(buff, () => {
            console.log("成功写完");
          });
        });
        client.on("error", err => {
          console.log(err);
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
