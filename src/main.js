import { createApp } from 'vue';
import App from '../app.vue';

const app = createApp(App);

app.mixin({
    mounted() {
      // Make the GET request to fetch the stocktaking list
      fetch('/stocktaking-list')
        .then(response => response.json())
        .then(data => {
          // Handle the response data
          console.log(data);
          // Do something with the data, e.g., update the component's data or state
        })
        .catch(error => {
          // Handle any errors
          console.error(error);
        });
    },
  });
  
  app.mount('#app');
