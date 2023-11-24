const crisp = require('crisp-api');
const CrispClient = new crisp();

const websiteID = "10f1498a-de68-4d4f-af8d-b9af89f3a764";
const TOKEN = {
    identifier: "1f671477-c9d3-4a28-b731-9b4080bb4eb9",
    key: "8a2b111a6559f07fdcd27aa27e7286797aed207fcde22fed709dd05c5d3dac52",
}


//  METHODS

const addProfileData = (values) => {
    return Promise.resolve()
        .then(() => {
            return createProfileIfNotExists(values.email, values.fullname);
        })
        .then(() => {
            return CrispClient.website.updatePeopleData(
                websiteID, values.email, {
                [values.dataKey]: values.dataValue
            }
            );
        })
        .then(() => {
            console.info("[info] data added for: " + values.email)
        })
        .catch((error) => {
            console.error("[error] general added for: " + values.email, error)
        })
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

// INITIALIZATION

console.log("[info] authentication...");

CrispClient.authenticateTier("plugin", TOKEN.identifier, TOKEN.key);

// USAGE

addProfileData({
    email: "huynhsy12425@gmail.com",
    fullname: "Tran Huynh Sy",
    dataKey: "product",
    dataValue: "Laptop"
})


console.info("[info] now waiting for the events")