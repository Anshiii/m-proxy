/* 用于测试用的 clent.js */

const net = require("net");

/* 向 p-client 发送连接 */
const client = net.createConnection(
  {
    host: "localhost",
    port: 6080
  },
  () => {
    /* 建立和服务的连接 */
    console.log("已经和服务端建立了链接");

    client.write(
      `CONNECT tips.mifengkong.cn:443 HTTP/1.1
Host: tips.mifengkong.cn:443

`,
      () => {
        console.log("客户端已发送");
      }
    );
  }
);

client.on("data", buff => {
  /* 来自 t-server 的响应,返回给 p-client */
  console.log("t-client 收到的响应", buff.toString());
});
