<template>
  <div class="header">
    <img
      src="~/assets/logo.png"
      alt="logo"
      class="logo"
    >

    <div class="cards">
      <vs-card>
        <template #title>
          <h3>Images</h3>
        </template>
        <template #text>
          <p>
            Over {{ images }} images have been uploaded to Astral.
          </p>
        </template>
      </vs-card>
      <vs-card>
        <template #title>
          <h3>Images</h3>
        </template>
        <template #text>
          <p>
            Over {{ images }} images have been uploaded to Astral.
          </p>
        </template>
      </vs-card>
      <vs-card>
        <template #title>
          <h3>Images</h3>
        </template>
        <template #text>
          <p>
            Over {{ images }} images have been uploaded to Astral.
          </p>
        </template>
      </vs-card>
    </div>

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
            images: 0,
            active: false,
        };
    },
};
</script>
