<template>
  <div class="container">
    <vs-navbar
      center-collapsed
      square
      color="#151515"
      class="navbar"
      text-white
    >
      <template #left>
        <img src="~/assets/logo.png" width="100px" alt="logo">
        <vs-navbar-item
          to="/"
        >
          Home
        </vs-navbar-item>
        <vs-navbar-item
          v-if="user.user"
          to="/dashboard"
          active
        >
          Dashboard
        </vs-navbar-item>
        <vs-navbar-item
          href="https://discord.gg/images"
        >
          Discord
        </vs-navbar-item>
      </template>

      <template #right>
        <vs-button v-if="!user.user" class="button" @click="activate('login')">
          <i class="bx bx-log-in" style="margin-right: 5px" /> Login
        </vs-button>
        <vs-button v-if="!user.user" class="button" @click="activate('register')">
          <i class="bx bxs-group" style="margin-right: 5px" /> Register
        </vs-button>
        <vs-button
          v-if="!user.user"
          icon
          class="phoneLogin"
          @click="active('login')"
        >
          <i class="bx bx-log-in" />
        </vs-button>
        <vs-button
          v-if="user.user"
          class="button"
          color="danger"
          flat
          @click="logout"
        >
          <i class="bx bx-log-out" style="margin-right: 7px; font-size: 17px" />Logout
        </vs-button>
      </template>
    </vs-navbar>
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
    },
    methods: {
        logout () {
            this.$axios.get('http://localhost:3000/api/auth/logout', { withCredentials: true })
                .then((res) => {
                    if (res.data.success) {
                        this.$router.push('/')
                    }
                }).catch(() => {
                    this.$router.push('/')
                })
        }
    }
}
</script>

<style>
.container {
  color: rgb(233, 233, 233);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar .vs-navbar {
  height: 60px;
}

.button {
  height: 40px;
  width: 100px;
}

@media only screen and (max-width: 586px) {
  .navbar .vs-navbar .vs-navbar__item {
    display: none;
  }

  .button {
    display: none;
  }
}
</style>
