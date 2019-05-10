const MProxy = require("../src/server");
/* use mProxy */
const options = {
  port: 6090
};

const mProxy = new MProxy(options);

mProxy.run();
