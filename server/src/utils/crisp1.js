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
    identifier: "1f671477-c9d3-4a28-b731-9b4080bb4eb9",
    key: "8a2b111a6559f07fdcd27aa27e7286797aed207fcde22fed709dd05c5d3dac52",
    signSecret: "920f16872daab701cbe01001521f46f5"
};

const pluginURN = "urn:sy.tran.huynh:projectmanagement:0"

const websiteID = "10f1498a-de68-4d4f-af8d-b9af89f3a764";

const HOOKS_SERVER = {
    port: 8082,
    path: "/"
};

console.info("Authenticating...");

// Create the Crisp client (it lets you access both the REST API and RTM events)
let CrispClient = new Crisp();

// // Authenticate to API with your plugin token (identifier, key)
// CrispClient.authenticateTier("plugin", TOKEN.identifier, TOKEN.key);

// // Set current RTM mode to Web Hooks
// CrispClient.setRtmMode(Crisp.RTM_MODES.WebHooks);




function addProfileData(values) {
    return Promise.resolve()
        .then(() => {
            return createProfileIfNotExists(values.email, values.fullname);
        })
        .then(() => {
            return CrispClient.website.updatePeopleData(
                websiteID, values.email, {
                [values.dataKey]: values.dataValue
            }
            )
        })
        .then(() => {
            console.info("[info] data added for: " + values.email);
        })
        .catch((error) => {
            console.error("[error] general error for: " + values.email, error);
        });
}

function createProfileIfNotExists(email, fullname) {
    return CrispClient.website.checkPeopleProfileExists(websiteID, email)
        .then(() => {
            console.log("[log] contact exists for: " + email);

            return Promise.resolve();
        })
        .catch(err => {
            if (err && err.reason === "people_not_found") {
                console.log("[log] contect does not exist for: " + email + ", creating...");

                return CrispClient.website.addNewPeopleProfile(websiteID, {
                    "email": email,
                    "person": {
                        "nickname": fullname
                    }
                });
            }

            return Promise.reject(err);
        })
}

function getProfile(values) {
    return Promise.resolve(() => {
        CrispClient.website.getPeopleProfile(websiteID, values.email);
    })
        .then(() => {
            console.log(values.email);
        })
        .catch(err => console.log(err));
}


// INITIALIZATION

console.info("[info] Authenticating...");

CrispClient.authenticateTier("plugin", TOKEN.identifier, TOKEN.key);

// USAGE

// addProfileData({
//     email: "huynhsy12425@gmail.com",
//     fullname: "Tran Huynh Sy",
//     dataKey: "product",
//     dataValue: "Laptop"
// })

getProfile({ email: "huynhsy12425@gmail.com" })