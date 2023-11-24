const crisp = require('crisp-api');
const CrispClient = new crisp();
const { inputSearch } = require('./ChatGPT')

const websiteID = "10f1498a-de68-4d4f-af8d-b9af89f3a764";
const TOKEN = {
    identifier: "1f671477-c9d3-4a28-b731-9b4080bb4eb9",
    key: "8a2b111a6559f07fdcd27aa27e7286797aed207fcde22fed709dd05c5d3dac52",
}


const info = {
    infoOfPage: `Tôi có một trang web như thế này, khi chưa đăng nhập thì tự động chuyển trang tới giao diện đăng nhập. Khi đăng nhập thành công sẽ chuyển tới trang task và sẽ hiển thị các task đã assign, các task chưa assign và thông kê thời gian thực hiện của user. Trên màn hình có thể click được vào task để hiển thị taskDetail, có hai link logout và task ở phía bên góc trên bên phải màn hình. Chỗ phần task chưa assign có nút add để tạo task mới, khi bấm vào sẽ chuyển trang đến trang tạo task nhập thông tin vào tạo task. Trong taskDetail có thông tin của task có nút update và nút finish. Khi bấm vào nút update sẽ chuyển trang vào updateTask và có thể cập nhật task, bên dưới còn có nút rejected và update. `,
    required:`Nếu người dùng hỏi câu nào liên quan thì mới trả lời các thông tin này ,nếu không gửi thông báo không hỗ trợ, trả lời như một assistant hỗ trợ trang, trả lời ngắn gọn, trả lời bằng Tiếng Việt.`
}


//  METHODS

async function responseWithMessage(sessionID, text) {
    try {
        await CrispClient.website.sendMessageInConversation(
            websiteID, sessionID,
            {
                type: "text",
                from: "operator",
                origin: "chat",
                content: text
            }
        );
        console.info("[info] message sent for: " + sessionID + " with: " + text);
    } catch (error) {
        console.error("[error] general error for: " + sessionID, error);
    }
}


// INITIALIZATION

console.log("[info] authentication...");

CrispClient.authenticateTier("plugin", TOKEN.identifier, TOKEN.key);

// USAGE

CrispClient.on("message:send", async function (message) {
    console.debug("[debug] got event: message:send", message);


    const content = `${info.infoOfPage} ${info.required} người dùng:'${message.content}'`
     console.log({content})
    const result = await inputSearch(`${content}`);
    await responseWithMessage(message.session_id, result.content)
})

CrispClient.on("message:received", function (message) {
    console.log("----------------- Received message ----------------")
    console.info("[Web Hooks] Got 'message:received' event:", message);
})



module.exports = {CrispClient, responseWithMessage};




















    // const listMessage = await list(message.session_id);
    // console.log(listMessage);
    // if (listMessage.active?.last === (Date.now())) {
    // let responseText;

    // // Filter on text message 
    // if (message.type === "text") {
    //     responseText = "Hi, how can i help you :";
    // } else {
    //     responseText = (
    //         "Oh, I only reply to text messages, not to: " + message.type
    //     )
    // }




    // .then(function () {
//     console.error("[Web Hooks] Requested to listen to received messages");
// })
// .catch(function (error) {
//     console.error("[Web Hooks] Failed listening to received messages:", error);
// });


// CrispClient.on("people:profile:created", function (profile) {
//     console.debug("[debug] got event: people:profile:created", profile);
// });




// const list = async (sessionID) => {
//     try {
//         const result = await CrispClient.website.listConversationPages(websiteID, sessionID, 1)
//         return result;
//     } catch (error) {
//         console.log(error);
//     }
// }



// khi chưa đăng nhập thì tự động chuyển trang tới giao diện đăng nhập. Khi đăng nhập thành công sẽ chuyển tới trang task và sẽ hiển thị các task đã assign, các task chưa assign và thông kê thời gian thực hiện của user. Trên màn hình có thể click được vào task để hiển thị taskDetail, có hai link logout và task ở phía bên góc trên bên phải màn hình. Chỗ phần task chưa assign có nút add để tạo task mới, khi bấm vào sẽ chuyển trang đến trang tạo task nhập thông tin vào tạo task. Trong taskDetail có thông tin của task có nút update và nút finish. Khi bấm vào nút update sẽ chuyển trang vào updateTask và có thể cập nhật task, bên dưới còn có nút rejected và update. 
// Hướng dẫn người dùng tạo task mới theo thông tin tôi cung cấp một cách ngắn ngọn