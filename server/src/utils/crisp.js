const Crisp = require("crisp-api");
let http = require("http");
let url = require("url");

const express = require("express");
const bodyParser = require("body-parser");

// <previous code eluded>

// Context
const app = express();

app.use(bodyParser.json());

const TOKEN = {
    identifier: "fb989f31-e014-47b1-9e8e-8ecfe419150e",
    key: "1cb85a5d663804e21d288fccceec128c43986de60b140b5012a83f5ce44775e6",
    signSecret: "cfc4fba5ba418e8e0e45dc897a583d0d"
};

const pluginURN = "urn:sy.tran.huynh:projectmanagement:0"

const websiteID = "10f1498a-de68-4d4f-af8d-b9af89f3a764";

// Configuration
const SECRET = "<your_web_hooks_secret_here>";

const HOOKS_SERVER = {
    port: 8082,
    path: "/"
};

console.info("Authenticating...");

// Create the Crisp client (it lets you access both the REST API and RTM events)
var CrispClient = new Crisp();

// Authenticate to API with your plugin token (identifier, key)
CrispClient.authenticateTier("plugin", TOKEN.identifier, TOKEN.key);

// Set current RTM mode to Web Hooks
CrispClient.setRtmMode(Crisp.RTM_MODES.WebHooks);

// <previous code eluded>


// Handlers
app.post("/", (request, response) => {
    console.log(
        `<-- ${request.protocol}://${request.get("host")}${request.originalUrl}\n`,
        request.body
    );

    response.sendStatus(200);

    // -- (you may want to verify the Web Hook signature before accepting it) --

    // Receive Web Hook payload
    var error = CrispClient.receiveHook(request.body);

    if (error !== null) {
        console.error("Web Hook processing error", error);
    }
});


app.get('/', function (req, res) {
    console.log("GET")
    res.status(200).json("success")
})


app.listen(HOOKS_SERVER.port, () => {
    console.log(`Hooks server listening at http://localhost:${HOOKS_SERVER.port}`);
});




















// CrispClient.website.listConversations(websiteID, 1)
//     .then(function (conversations) {
//         console.log("Listed conversations:", conversations);
//     })
//     .catch(function (error) {
//         console.error("Error listing conversations:", error);
//     });

// CrispClient.on("message:send", function (message) {
//     console.log({ message })
//     // Filter on text messages
//     if (message.type === "text") {
//         console.info(
//             "Got text message from visitor with content:", message.content
//         );
//     }
// });

// CrispClient.on("message:send", function (message) {
//     CrispClient.website.sendMessageInConversation(
//         message.website_id, message.session_id,

//         {
//             type: "text",
//             content: "I'm a bot",
//             from: "operator", // or user
//             origin: "chat"
//         }
//     )
//         .then(function (message) {
//             console.log("Message sent:", message);
//         })
//         .catch(function (error) {
//             console.error("Error sending message:", error);
//         });
// })
//     .then(function () {
//         console.error("Requested to listen to sent messages");
//     })
//     .catch(function (error) {
//         console.error("Failed listening to sent messages:", error);
//     });




// function createProfileNotExist(email, fullname) {
//     // return
// }


// CrispClient.on("message:send", function (message) {
//     console.info("[Web Hooks] Got 'message:send' event:", message);
// })
//     .then(function () {
//         console.error("[Web Hooks] Requested to listen to sent messages");
//     })
//     .catch(function (error) {
//         console.error("[Web Hooks] Failed listening to sent messages:", error);
//     });

// var error = CrispClient.receiveHook(req.body);


// var _handleIncomingRequest = function (request, response, body) {
//     // Handle request?
//     var responseStatus = 404,
//         requestURL = url.parse(request.url);

//     if (requestURL && requestURL.pathname === HOOKS_SERVER.path) {
//         switch (request.method) {
//             case "POST": {
//                 responseStatus = _processWebhooksEvent(request, body);
//                 break;
//             }

//             default: {
//                 responseStatus = 405;
//             }
//         }
//     }

//     // Send response
//     response.writeHead(responseStatus, {
//         "Content-Type": "text/plain"
//     });

//     response.end(http.STATUS_CODES[responseStatus]);
// };












// http
//     .createServer(function (req, res) {
//         console.log({ req })
//         console.debug(
//             "[Web Hooks] Received HTTP req: " + req.method + " " + req.url
//         );

//         var bodyBuffer = "";

//         req
//             .on("data", function (chunk) {
//                 bodyBuffer += chunk;
//             })
//             .on("end", function () {
//                 // Attempt to parse body to JSON
//                 var body = null;

//                 try {
//                     if (bodyBuffer) {
//                         body = JSON.parse(bodyBuffer);
//                     }
//                 } catch (_) {
//                     // Ignore errors
//                 }

//                 // Pass req to handler
//                 // _handleIncomingRequest(req, res, body);
//             })
//             .setEncoding("utf8");
//     })
//     .listen(HOOKS_SERVER.port);