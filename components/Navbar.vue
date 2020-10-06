<template>
  <div>
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
          :active="enabled === 'home'"
        >
          Home
        </vs-navbar-item>
        <vs-navbar-item
          to="/domains"
          :active="enabled === 'domains'"
        >
          Domains
        </vs-navbar-item>
        <vs-navbar-item
          to="/dashboard"
          :active="enabled === 'dashboard'"
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

    <vs-dialog v-model="active.login" blur class="auth-box">
      <template #header>
        <h4 class="header-text">
          Login
        </h4>
      </template>

      <vs-alert v-if="error !== ''" color="danger" class="error-box">
        {{ error }}
      </vs-alert>

      <div class="con-form">
        <vs-input
          v-model="username"
          type="text"
          placeholder="Username"
          :value="username !== '' ? username : ''"
          @input="setInput($event, 'username')"
        />
        <vs-input
          v-model="password"
          type="password"
          placeholder="Password"
          :value="invite !== '' ? invite : ''"
          @input="setInput($event, 'invite')"
        />
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block color="danger" class="dialog-button" @click="login">
            Login
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog v-model="active.register" blur class="auth-box">
      <template #header>
        <h4 class="header-text">
          Register
        </h4>
      </template>

      <vs-alert v-if="error !== ''" color="danger" class="error-box">
        {{ error }}
      </vs-alert>

      <div class="con-form">
        <vs-input
          v-model="username"
          type="text"
          placeholder="Username"
          :value="username !== '' ? username : ''"
          @input="setInput($event, 'username')"
        />
        <vs-input
          v-model="password"
          type="password"
          placeholder="Password"
          :value="password !== '' ? password : ''"
          @input="setInput($event, 'password')"
        />
        <vs-input
          type="text"
          placeholder="Invite Code"
          :value="invite !== '' ? invite : ''"
          @input="setInput($event, 'invite')"
        />
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block color="danger" class="dialog-button" @click="register">
            Register
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    enabled: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
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
