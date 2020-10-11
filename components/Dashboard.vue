<template>
  <div class="container">
    <h1>
      {{ user.user }}
    </h1>
  </div>
</template>

<script>
// import { Chrome } from 'vue-color';

export default {
    name: 'Dashboard',
    // components: {
    //     Chrome
    // },
    props: {
        user: {
            type: Object,
            default () {
                return {}
            }
        }
    }
}
</script>

<style>
.container {

}
</style>
