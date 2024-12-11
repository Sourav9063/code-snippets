const cluster = require("cluster");
const os = require("os");
const { setupPrimary } = require("@socket.io/cluster-adapter");
const { setupMaster } = require("@socket.io/sticky");
const { createServer } = require("http");

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  const httpServer = createServer();
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });
  setupPrimary();
  cluster.setupPrimary({
    serialization: "advanced",
  });
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  require("./server");
}

cluster.on("exit", (worker) => {
  cluster.fork();
});
