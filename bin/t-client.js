/* 用于测试用的 clent.js */

const net = require("net");

const client = net.createConnection(
  {
    host: "localhost",
    port: 6080
  },
  socket => {
    /* 建立和服务的连接 */
    console.log("已经和服务的建立了链接");

    client.write("GET /test/index.html HTTP/1.1", () => {
      console.log("客户端已发送");
    });
  }
);

client.on("data", data => {
  console.log("收到了data", data.toString());
});
