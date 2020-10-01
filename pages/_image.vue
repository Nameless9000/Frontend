<template>
  <div>
    <div v-if="file" style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin-top: 250px">
      <img :src="`http://localhost:3000/i/${file.file.file.name}`" alt="image">
      <h1 style="color: white; font-size: 25px; margin-top: 20px">
        {{ file.file.file.originalName }} uploaded by {{ file.file.user }} on {{ file.file.file.date }}
      </h1>
    </div>
    <div v-else>
      <h1 style="color: white">
        Invalid file.
      </h1>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';

export default {
    async asyncData (context) {
        const res = await Axios.get(`http://localhost:3000/files/${context.params.image}`);
        if (res.data.success) {
            if (res.data.file.display.type === 'raw') {
                context.redirect(`http://localhost:3000/i/${res.data.file.file.name}`);
            } else {
                return {
                    file: res.data,
                };
            }
        }
    },
    data () {
        return {
            file: null,
        };
    },
    head () {
        if (this.file !== null) {
            const tags = [];
            if (this.file.file.display.type === 'embed') {
                tags.push(
                    {
                        hid: 'title',
                        name: 'title',
                        content: this.file.file.display.embed.title,
                    },
                    {
                        hid: 'theme-color',
                        name: 'theme-color',
                        content: this.file.file.display.embed.color,
                    },
                    {
                        hid: 'image',
                        name: 'image',
                        content: `https://astral.cool/i/${this.file.file.file.name}`,
                    },
                    {
                        hid: 'card',
                        name: 'card',
                        content: 'summary_large_image',
                    }
                );
                if (this.file.file.display.embed.text !== null && this.file.file.display.embed.text !== '') {
                    tags.push({
                        hid: 'description',
                        name: 'description',
                        content: this.file.file.display.embed.text,
                    });
                }
            }
            return {
                title: this.file.file.file.name,
                meta: tags,
            };
        }
    },
};
</script>
