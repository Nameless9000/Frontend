<template>
  <div class="header">
    <img
      src="~/assets/logo.png"
      alt="logo"
      class="logo"
    >

    <p class="caption">
      The superior image hosting service.
    </p>

    <!-- <div class="cards">
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
          <h3>Users</h3>
        </template>
        <template #text>
          <p>
            Over {{ users }} users are using Astral.
          </p>
        </template>
      </vs-card>
    </div> -->

    <div class="buttons">
      <vs-button class="button" size="large" color="danger" @click="active=!active">
        Login
      </vs-button>
      <vs-button class="button" size="large" color="danger" @click="active=!active">
        Register
      </vs-button>
    </div>

    <vs-dialog v-model="active" blur class="auth-box">
      <template #header>
        <h4 class="header-text">
          Login
        </h4>
      </template>

      <div class="con-form">
        <vs-input v-model="email" placeholder="Email" />
        <vs-input v-model="password" type="password" placeholder="Password" />
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block color="danger" class="dialog-button">
            Login
          </vs-button>
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
            users: 0,
            active: false,
        };
    },
};
</script>

<style lang="stylus">
    getColor(vsColor, alpha = 1)
        unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
    getVar(var)
        unquote("var(--vs-"+var+")")
    .not-margin
      margin 0px
      font-weight normal
      padding 10px
    .con-form
      width 100%
      .flex
        display flex
        align-items center
        justify-content space-between
        a
          font-size .8rem
          opacity .7
          &:hover
            opacity 1
      .vs-checkbox-label
        font-size .8rem
      .vs-input-content
        margin 10px 0px
        width calc(100%)
        .vs-input
          width 100%
    .footer-dialog
      display flex
      align-items center
      justify-content center
      flex-direction column
      width calc(100%)
      .new
        margin 0px
        margin-top 20px
        padding: 0px
        font-size .7rem
        a
          color getColor('primary') !important
          margin-left 6px
          &:hover
            text-decoration underline
    </style>
