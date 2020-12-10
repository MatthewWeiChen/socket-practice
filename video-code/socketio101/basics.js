//we need http because we don't have express

const httpServer = require("http").createServer((req, res) => {
  res.end("I am connected!");
});

//we need socketio... it's 3rd party!
const socketio = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  },
});

//we make an http server with node!
// const io = socketio(httpServer);

socketio.on("connection", (socket, req) => {
  //ws.send becomes socket.emit
  socket.emit("welcome", "Welcome to the websocket server!!");
  socket.on("message", (msg) => {
    console.log(msg);
  });
});

httpServer.listen(8000, () => console.log("listening on port 8000"));
