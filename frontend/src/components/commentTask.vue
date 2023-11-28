<template>
  <div class="w-full justify-center flex flex-col text-lg">
    <form class="w-full mx-auto">
      <div class="flex justify-end h-14">
        <textarea
          id="message"
          rows="2"
          v-model="commentEntity.content"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Leave a comment..."
        ></textarea>
        <button
          type="button"
          @click="handleCreateComment"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 h-full"
        >
          Send
        </button>
      </div>
    </form>
    <!-- <div class="message-feedback">
      <p class="feedback">People is typing a message....</p>
    </div> -->
    <div
      v-if="commentList?.length !== 0"
      style="height: 500px"
      class="main w-full mt-2 message-container"
    >
      <ul
        v-for="(comment, name, index) in commentList"
        :key="index"
        class="message-content w-full px-2 py-1 mt-1"
      >
        <li
          v-if="comment?.userId?._id !== userId"
          class="message-left"
          style="width: 75%"
        >
          <span class="name">{{ comment?.userId?.username }}</span>
          <p class="message">{{ comment.content }}</p>
          <span class="createdAt">{{ comment?.createdAt }}</span>
        </li>
        <li
          v-if="comment?.userId?._id === userId"
          class="message-right"
          style="width: 75%"
        >
          <span class="name">{{ comment?.userId?.username }}</span>
          <p class="message">{{ comment.content }}</p>
          <span class="createdAt">{{ comment?.createdAt }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import httpRequest from "@/utils/httpRequest";
import { comment } from "postcss";
import { onMounted, ref, reactive, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
const ws = new WebSocket("ws://localhost:8082");

// import socket from "../socket";

const messageContainer =
  document.getElementsByClassName("message-container")[0];

let props = defineProps(["errMessage"]);
const route = useRoute();
const router = useRouter();
const taskId = route.params.id;
const userId = ref();

const commentEntity = ref({
  taskId: taskId,
  content: "",
});

const commentList = ref();

onMounted(async () => {
  try {
    ws.onopen = () => {
      console.log("opened");
    };
    const user = await httpRequest.get("/users/");
    userId.value = user.result._id;

    const comments = await httpRequest.get(`/comments/${taskId}/list`);
    commentList.value = [...comments.comments?.reverse()];
    console.log(commentList.value);
  } catch (error) {
    console.error(error);
    if (error?.status) {
      props.errMessage = error.data.messageCode;
    }
  }
});

onBeforeUnmount(async () => {
  ws.close(1000, "goodbye");
});

const handleCreateComment = async () => {
  try {
    if (ws.readyState === WebSocket.OPEN) {
      // Send the comment as a JSON string or in the format expected by your server
      console.log(commentEntity.value.content);
      console.log(
        commentEntity.value.content && commentEntity.value.content !== ""
      );
      if (commentEntity.value.content && commentEntity.value.content !== "") {
        // await httpRequest.post(`/comments/create`, commentEntity.value);
        const comments = await httpRequest.get(`/comments/${taskId}/list`);

        console.log({ comments });
        console.log(
          JSON.stringify(comments.comments[comments.comments.length - 1])
        );
        ws.send(JSON.stringify(commentEntity.value));
        ws.onmessage = async (message) => {
          const message1 = message.data;
          const text = await new Response(message1).text();
          const parseComment = JSON.parse(text);

          commentList.value.unshift(parseComment);
        };

        // router.push({ path: `/tasks/${taskId}` }).then(() => {
        //   router.go();
        // });
      }
    } else {
      console.error(
        "WebSocket is not in the OPEN state. Unable to send message."
      );
    }
  } catch (error) {
    console.log(error);
  }

  commentEntity.value.content = "";
};

// --------------------- WebSocket --------------------
// import WebSocket from "ws";
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Open+Sans:ital,wght@0,300;0,600;0,700;0,800;1,600&display=swap");

body {
  font-family: "Open Sans", sans-serif;
}

.title {
  margin: 20px 0;
}

.main {
  border: 8px solid #dddddd;
  border-radius: 5px;
  overflow: hidden;
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #7e7e7e;
  align-self: flex-start;
}

.message-container {
  display: block;
  background-color: #f6f6f6;
  overflow-y: scroll;
  overflow-x: hidden;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-left,
.message-right {
  list-style: none;
  max-width: 250px;
  font-size: 20px;
  padding: 5px 10px;
  word-wrap: break-word;
}

.message-left {
  border-radius: 20px 20px 20px 0px;
  align-self: flex-start;
  background-color: #fff;
  box-shadow: -2px 2px 4px #dcdcdc;
}

.message-right {
  border-radius: 20px 20px 0px 20px;
  align-self: flex-end;
  box-shadow: 2px 2px 4px #dcdcdc;
  background-color: #cac8c8;
}

.createdAt {
  display: block;
  text-align: end;
  font-style: italic;
  font-size: 12px;
}
</style>