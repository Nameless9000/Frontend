<template>
  <div @mouseenter="unhide">
    {{ text }}
  </div>
</template>

<script>
export default {
    name: 'Spoiler',
    props: {
        text: {
            type: String,
            default: '',
        },
    },
    data () {
        return {
            show: false,
            hovering: false,
        };
    },
};
</script>
