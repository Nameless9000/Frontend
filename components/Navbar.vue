<template>
  <div class="navbar">
    <vs-navbar
      center-collapsed
      dark
      text-white
      class="navbar"
      square
    >
      <template #left>
        <img src="~/assets/logo.png" width="100px" alt="logo">
        <vs-navbar-item to="/dashboard" :active="enabled === 'home'">
          Home
        </vs-navbar-item>
        <vs-navbar-item to="/profile" :active="enabled === 'profile'">
          Profile
        </vs-navbar-item>
      </template>
      <template #right>
        <vs-button flat @click="logout">
          <i class="bx bx-log-out" style="margin-right: 7px" />Logout
        </vs-button>
      </template>
    </vs-navbar>
  </div>
</template>

<script>
export default {
    name: 'Navbar',
    props: {
        enabled: {
            type: String,
            default: '',
        },
    },
    methods: {
        logout () {
            this.$axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
                .then((res) => {
                    this.$router.push('/');
                }).catch(() => {
                    this.$router.push('/');
                });
        },
    },
};
</script>
