<template>
  <div class="header">
    <vs-navbar v-model="active" center-collapsed color="#1f1f1f">
      <template #left>
        <img src="~/assets/logo.png" style="width: 100px" alt="">
      </template>
      <vs-navbar-item id="guide" :active="active == 'guide'">
        Guide
      </vs-navbar-item>
      <vs-navbar-item id="docs" :active="active == 'docs'">
        Documents
      </vs-navbar-item>
      <vs-navbar-item id="components" :active="active == 'components'">
        Components
      </vs-navbar-item>
      <vs-navbar-item id="license" :active="active == 'license'">
        license
      </vs-navbar-item>
      <template #right>
        <vs-button flat>
          Login
        </vs-button>
        <vs-button>Get Started</vs-button>
      </template>
    </vs-navbar>

    <img
      src="~/assets/logo.png"
      alt="logo"
      class="logo"
    >
    <p class="caption">
      The ultimate ShareX experience.
    </p>

    <div class="buttons">
      <vs-button class="button" size="large" color="danger" @click="active=!active">
        Login
      </vs-button>
      <vs-button class="button" size="large" color="danger" @click="active=!active">
        Register
      </vs-button>
    </div>

    <vs-dialog v-model="active">
      <template #header>
        <h4 class="not-margin">
          Login
        </h4>
      </template>

      <div class="con-form">
        <vs-input v-model="email" placeholder="Email">
          <template #icon>
            @
          </template>
        </vs-input>
        <vs-input v-model="password" type="password" placeholder="Password">
          <template #icon>
            <i class="bx bxs-lock" />
          </template>
        </vs-input>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block>
            Sign In
          </vs-button>

          <div class="new">
            New Here? <a href="#">Create New Account</a>
          </div>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
    data () {
        return {
            active: false,
        };
    },
};
</script>
