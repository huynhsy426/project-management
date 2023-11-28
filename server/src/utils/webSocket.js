const wss = require("../../server");

// module.exports = handleWebsocket = (req, res, next) => {
//     wss.on("connection", async function connection(ws) {
//         console.log({ asdasd: req.headers })
//         console.log("new client connection")

//         ws.on("close", () => {
//             console.log("client disconnected")
//         })

//         ws.on("error", (err) => {
//             conosole.log(err)
//         })

//         ws.on("message", (message) => {
//             console.log("hereroi12u3o");

//             console.log("Type of message:", typeof message);
//             console.log("Content of message:", message.toString());

//             try {
//                 // Convert buffer to string and parse as JSON
//                 const stringMessage = message.toString('utf-8'); // Adjust the encoding if needed
//                 const parsedMessage = JSON.parse(stringMessage);
//                 console.log("received", parsedMessage);
//             } catch (error) {
//                 console.error("Error parsing JSON:", error);
//             }

//             ws.send("xuong lai");
//         });

//         return next();
//     })
// }