<template>
  <div>
    <h1>
      hi
    </h1>
  </div>
</template>

<script>
import Axios from 'axios';

export default {
    asyncData (context) {
        Axios.get(`http://localhost:3000/files/${context.params.image}`)
            .then((res) => {
                console.log(res.data);
            });
    },
};
</script>
