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
          active
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
        <vs-button class="button" @click="activate('login')">
          <i class="bx bx-log-in" style="margin-right: 5px" /> Login
        </vs-button>
        <vs-button class="button" @click="activate('register')">
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

    <vs-dialog v-model="active.login" blur>
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
          type="text"
          placeholder="Username"
          :value="username !== '' ? username : ''"
          @input="setInput($event, 'username')"
        />
        <vs-input
          type="password"
          placeholder="Password"
          :value="password !== '' ? password : ''"
          @input="setInput($event, 'password')"
        />
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button
            block
            color="danger"
            class="dialog-button"
            @click="login"
          >
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
          type="text"
          placeholder="Username"
          :value="username !== '' ? username : ''"
          @input="setInput($event, 'username')"
        />
        <vs-input
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
          <vs-button
            block
            color="danger"
            class="dialog-button"
            @click="register"
          >
            Register
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
export default {
    asyncData (context) {
        const code = context.query.code
        if (code) {
            return {
                active: {
                    login: false,
                    register: true
                },
                invite: code
            }
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
        }
    },
    mounted () {
        this.$vs.setTheme('dark')
    },
    methods: {
        activate (property) {
            this.error = ''
            this.resetForm()
            this.active[property] = true
        },
        setInput (val, property) {
            this[property] = val
        },
        resetForm () {
            this.username = ''
            this.password = ''
            this.invite = ''
        },
        async login () {
            if (this.username.length <= 0 || this.password.length <= 0) {
                this.resetForm()
                this.error = 'Please fill out all the fields.'
            } else {
                const res = await this.$axios.post('http://localhost:3000/auth/login', {
                    username: this.username,
                    password: this.password
                }, {
                    withCredentials: true
                })
                if (res.data.success) {
                    window.location.href = 'http://localhost:3001/dashboard'
                } else {
                    this.resetForm()
                    this.error = res.data.message
                }
            }
        },
        async register () {
            if (this.username.length <= 0 || this.password.length <= 0 || this.invite.length <= 0) {
                this.resetForm()
                this.error = 'Please fill out all the fields.'
            } else {
                const res = await this.$axios.post('http://localhost:3000/auth/register', {
                    username: this.username,
                    password: this.password,
                    invite: this.invite
                }, {
                    withCredentials: true
                })
                if (res.data.success) {
                    window.location.href = 'http://localhost:3001/dashboard'
                } else {
                    this.resetForm()
                    this.error = res.data.message
                }
            }
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

.header-text {
  font-size: 17px;
  color: white;
  font-weight: normal;
  margin-bottom: -10px;
}

.error-box {
  margin-top: 0px;
  margin-bottom: 5px;
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
    margin-bottom -5px
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
      margin 5px 0px
      width calc(100%)
      .vs-input
        height 35px
        width 100%
  .footer-dialog
    display flex
    align-items center
    justify-content center
    flex-direction column
    width calc(100%)
    .new
      margin 0px
      margin-top 21px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
</style>
