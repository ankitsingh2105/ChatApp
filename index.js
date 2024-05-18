const express = require("express");

const app = express();

// making http modules

// Importing the 'http' module for creating HTTP servers
const http = require("http");

// Creating an HTTP server using an Express app instance ('app')
const server = http.createServer(app);

// Importing the 'Server' class from the 'socket.io' library
const { Server } = require("socket.io");

// Creating a new instance of the 'Server' class by passing the HTTP server instance
const io = new Server(server);

// Event listener for when a new client connects to the Socket.IO server
io.on("connection", (client) => {

    // Logging a message indicating a new user has connected, along with their unique ID
    console.log("New user has connected", client.id);

    // Event listener for when the client sends a 'user-message' event
    let roomID;
    client.on("user-message-name-room", (userInfo) => {
        // Logging the received message
        userInfo["user_id"] = client.id;
        console.log("User Info:", userInfo);

        // Broadcasting the received message to all connected clients
        // io.emit("message and name", userInfo);
        io.to(userInfo.room_Id).emit("message and name", userInfo);

    });

    client.on("typing" , (name)=>{
        console.log("client typing ", name , "and :: " , roomID);
        io.to(roomID).emit("typing" , name);
    })
    
    client.on("stopTyping" , ()=>{
        io.to(roomID).emit("stopTyping");
    })

    client.on('joinRoom', function(room) {
        roomID = room;
        console.log("room is :: ", room);
        client.join(room);
    });

});




// todo :: express.static(): This function is built-in middleware in Express.js used to serve static files such as images, CSS files, JavaScript files, 

// todo :: "Serving static files" means providing files directly to web clients without any processing by a server-side program or script. These files are typically things like HTML, CSS, JavaScript, images, or other resources that make up the content and presentation of a web page or application.

app.use(express.static("./public"));

app.get("/", (req, response) => {
    response.sendFile("./index.html");
})

server.listen("3000", () => {
    console.log("ok");
})
// C:\Users\user\Desktop\Nodejs\Web Sockets\index.html




// In Socket.IO, there are two types of events: server-side events and client-side events.

// Server-side events: These events are emitted from the server to the clients. You use io.emit() or socket.emit() on the server to send these events.

// Client-side events: These events are emitted from the client to the server. You use socket.emit() on the client to send these events.

// Here's a general guideline to decide which type of event to emit:

// Server-side events (io.emit()):

// Use these when you want to send data or messages from the server to all connected clients.
// For example, when a new user joins the chat, you would emit a server-side event to inform all clients about the new user.
// Client-side events (socket.emit()):

// Use these when you want to send data or messages from a specific client to the server.
// For example, when a user sends a message in the chat, you would emit a client-side event to send that message to the server.
// In your code snippet:

// javascript
// Copy code
// client.on("user-message", (message) => {
//     // Logging the received message
//     console.log("New message:", message);

//     // Broadcasting the received message to all connected clients
//     io.emit("message", message);
// });
// The client.on("user-message", ...) line is listening for a client-side event named "user-message". This event is emitted from a specific client to the server when the client sends a message.
// Inside the callback function, you're logging the received message and then broadcasting it to all connected clients using io.emit("message", message). This emits a server-side event named "message", which sends the message to all clients.





