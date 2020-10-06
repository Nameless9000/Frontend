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
          active="true"
        >
          Home
        </vs-navbar-item>
        <vs-navbar-item
          to="/domains"
        >
          Domains
        </vs-navbar-item>
        <vs-navbar-item
          to="/dashboard"
        >
          Dashboard
        </vs-navbar-item>
      </template>

      <template #right>
        <vs-button class="button">
          <i class="bx bx-log-in" style="margin-right: 5px" /> Login
        </vs-button>
        <vs-button class="button">
          <i class="bx bxs-group" style="margin-right: 5px" /> Register
        </vs-button>
        <vs-button
          icon
          class="phoneLogin"
        >
          <i class="bx bx-log-in" />
        </vs-button>
      </template>
    </vs-navbar>

    <div class="main">
      <img
        src="~/assets/logo.png"
        width="400px"
        alt="logo"
      >
      <p class="caption">
        The superior image hosting service.
      </p>
    </div>
  </div>
</template>

<script>
export default {
    asyncData (context) {
        const code = context.query.code;
        if (code) {
            return {
                active: {
                    login: false,
                    register: true
                },
                invite: code
            };
        }
    },
    data () {
        return {
            username: '',
            password: '',
            invite: '',
            error: '',
            active: {
                login: false,
                register: false
            }
        };
    }
};
</script>

<style>
.container {
  color: rgb(233, 233, 233);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
}

.caption {
  margin-top: -5px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
}

.navbar .vs-navbar {
  height: 60px;
}

.button {
  height: 40px;
  width: 100px;
}

.phoneLogin {
  display: none;
}

@media only screen and (max-width: 586px) {
  .main {
    margin-left: 10px;
  }

  .button {
    display: none;
  }

  .navbar .vs-navbar .vs-navbar__item {
    display: none;
  }

  .phoneLogin {
    display: flex;
    margin-right: 10px;
  }
}
</style>
