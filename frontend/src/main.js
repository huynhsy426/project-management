import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faFile, faFileAudio, faFileImage, faFileVideo } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faFile, faTrash, faFileAudio, faFileImage, faFileVideo)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app')
