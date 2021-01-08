import server from "@config/server";

after("after", function () {
  server.stop();
});
