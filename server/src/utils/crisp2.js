const http = require("http");
const url = require("url");

const TOKEN = {
    identifier: "1f671477-c9d3-4a28-b731-9b4080bb4eb9",
    key: "8a2b111a6559f07fdcd27aa27e7286797aed207fcde22fed709dd05c5d3dac52",
    signSecret: "920f16872daab701cbe01001521f46f5"
};

const HOOKS_SERVER = {
    port: 8082,
    path: "/"
};

const websiteID = "10f1498a-de68-4d4f-af8d-b9af89f3a764";

const Crisp = require("crisp-api");
let CrispClient = new Crisp();


console.info("Authenticating...");

CrispClient.authenticateTier("plugin", TOKEN.identifier, TOKEN.key);
CrispClient.setRtmMode(Crisp.RTM_MODES.WebHooks);



console.info("Listening for events...");

CrispClient.on("message:send", function (message) {
    console.info("[Web Hooks] Got 'message:send' event:", message);
})
    .then(function () {
        console.error("[Web Hooks] Requested to listen to sent messages");
    })
    .catch(function (error) {
        console.error("[Web Hooks] Failed listening to sent messages:", error);
    });

CrispClient.on("message:received", function (message) {
    console.info("[Web Hooks] Got 'message:received' event:", message);
})
    .then(function () {
        console.error("[Web Hooks] Requested to listen to received messages");
    })
    .catch(function (error) {
        console.error("[Web Hooks] Failed listening to received messages:", error);
    });


console.info(
    "Starting Web Hooks HTTP endpoint at " +
    ("http://localhost:" + HOOKS_SERVER.port + "/")
);

let _processWebhooksEvent = function (request, body) {
    let secret = TOKEN.signSecret,
        timestamp = request.headers["x-crisp-request-timestamp"],
        signature = request.headers["x-crisp-signature"];

    // Verify Web Hook payload
    if (CrispClient.verifyHook(secret, body, timestamp, signature) !== true) {
        console.log({ secret, body, timestamp, signature })
        console.warn(
            "[Web Hooks] Web Hooks request could not be verified with signature: " +
            (signature || "(?)")
        );

        return 403;
    }

    // Receive Web Hook payload
    let error = CrispClient.receiveHook(body);

    if (error !== null) {
        console.error(
            "[Web Hooks] Web Hooks payload processing error: " + error.toString()
        );

        return 400;
    }

    console.info(
        "[Web Hooks] Web Hooks payload processed:\n \\->", body
    );

    return 200;
};

let _handleIncomingRequest = function (request, response, body) {
    // Handle request?
    let responseStatus = 404,
        requestURL = url.parse(request.url);

    if (requestURL && requestURL.pathname === HOOKS_SERVER.path) {
        switch (request.method) {
            case "POST": {
                responseStatus = _processWebhooksEvent(request, body);

                break;
            }

            default: {
                responseStatus = 405;
            }
        }
    }

    // Send response
    response.writeHead(responseStatus, {
        "Content-Type": "text/plain"
    });

    response.end(http.STATUS_CODES[responseStatus]);
};


const list = () => {
    return Promise.resolve(() => {
        return CrispClient.website.listConversations(websiteID, 1)
    })
        .then(function (conversations) {
            console.log("Listed conversations:", conversations);
        })
        .catch(function (error) {
            console.error("Error listing conversations:", error);
        });
}

http
    .createServer(function (request, response) {
        console.debug(
            "[Web Hooks] Received HTTP request: " + request.method + " " + request.url
        );
        let bodyBuffer = "";

        request
            .on("data", function (chunk) {
                bodyBuffer += chunk;
            })
            .on("end", function () {
                // Attempt to parse body to JSON
                let body = null;

                try {
                    if (bodyBuffer) {
                        body = JSON.parse(bodyBuffer);
                    }
                } catch (_) {
                    // Ignore errors
                }

                // Pass request to handler
                _handleIncomingRequest(request, response, body);
            })
            .setEncoding("utf8");
    })
    .listen(HOOKS_SERVER.port);
