<template>
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin-top: 250px">
    <img :src="`http://localhost:3000/i/${file.file.file.name}`" alt="image">
    <h1 style="color: white">
      {{ file.file.file.originalName }} uploaded by {{ file.file.user }} on {{ file.file.file.date }}
    </h1>
  </div>
</template>

<script>
import Axios from 'axios';

export default {
    async asyncData (context) {
        const res = await Axios.get(`http://localhost:3000/files/${context.params.image}`);
        return {
            file: res.data,
        };
    },
    data () {
        return {
            file: null,
        };
    },
    head () {
        return {
            title: this.file.file.file.originalName,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                {
                    hid: 'description',
                    name: 'description',
                    content: 'My custom description',
                },
            ],
        };
    },
};
</script>
