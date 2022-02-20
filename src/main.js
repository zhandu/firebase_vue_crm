import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import messagePlugin from './utils/message.plugin'
import Loader from '@/components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "AIzaSyAxc9VSBQceQnklmrygb_gEDOrwgDsistQ",
  authDomain: "vue-crm-b7fc2.firebaseapp.com",
  projectId: "vue-crm-b7fc2",
  storageBucket: "vue-crm-b7fc2.appspot.com",
  messagingSenderId: "992119449047",
  appId: "1:992119449047:web:5ce2a07f3ef2a237e05792",
  databaseURL: "https://vue-crm-b7fc2-default-rtdb.europe-west1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig)

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
    .component('Loader', Loader)
    .use(store)
    .use(router)
    .use(messagePlugin)
    .mount('#app')
  }
})
