<template>
  <div class="header">
    <TheNavigation />
    <img src="~/assets/logo.png">
    <h1>Dashboard Page</h1>
  </div>
</template>

<script>
export default {
    data () {
        return {
            user: {},
        };
    },
    // async created () {
    //     const res = await this.$axios.get('http://localhost:3000/users/@me', { withCredentials: true });
    // },
};
</script>
