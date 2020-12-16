const socket = io("http://localhost:8000");
let nsSocket = "";
//listen for nsList, which is a list of all the namespaces

socket.on("nsList", (nsData) => {
  // console.log("The list of namespaces has arrived!!");
  // console.log(nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });
  //set up click listener to each namespace

  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      // console.log(nsEndpoint);
      joinNs(nsEndpoint);
    });
  });
  joinNs("/wiki");
});
