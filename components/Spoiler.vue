<template>
  <div
    :style="hovering ? '' : 'filter: blur(4px)'"
    class="fade-in"
    @mouseenter="unhide"
    @mouseleave="hide"
  >
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
            hovering: false,
        };
    },
    methods: {
        unhide () {
            this.hovering = true;
        },
        hide () {
            this.hovering = false;
        },
    },
};
</script>
