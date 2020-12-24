//client side

//this function is called when the user clicks on the start button
function init() {
  //start drawing the screen
  draw();
  // console.log(orbs);
  //call the init event when the client is ready for the data
  socket.emit("init", {
    playerName: player.name,
  });
}

let socket = io.connect("http://localhost:8080");

socket.on("initReturn", (data) => {
  orbs = data.orbs;
});

socket.on("tock", (data) => {
  console.log(data);
});
