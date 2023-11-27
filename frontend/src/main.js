import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/index';
import { Crisp } from "crisp-sdk-web";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faFile, faFileAudio, faFileImage, faFileVideo } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


/* add icons to the library */
library.add(faFile, faTrash, faFileAudio, faFileImage, faFileVideo)

const websiteId = "10f1498a-de68-4d4f-af8d-b9af89f3a764";

Crisp.configure(websiteId, {
    autoload: true
});


const app = createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)


app.mount('#app')
