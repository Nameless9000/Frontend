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

    <div class="buttons">
      <vs-button class="button" size="large" color="danger" @click="activate('login')">
        Login
      </vs-button>
      <vs-button class="button" size="large" color="danger" @click="activate('register')">
        Register
      </vs-button>
    </div>

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
    asyncData (context) {
        const code = context.query.code;
        if (code) {
            return {
                active: {
                    login: false,
                    register: true,
                },
                invite: code,
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
                register: false,
            },
        };
    },
    created () {
        this.$axios.get('http://localhost:3000/users/@me', { withCredentials: true })
            .then((res) => {
                const spinner = this.$vs.loading({
                    background: '#050506',
                });
                if (res.data) {
                    setTimeout(() => {
                        spinner.close();
                        this.$router.push('/dashboard');
                    }, 800);
                } else {
                    setTimeout(() => {
                        spinner.close();
                    }, 800);
                }
            }).catch(() => {});
    },
    methods: {
        activate (property) {
            this.error = '';
            this.active[property] = true;
        },
        setInput (val, property) {
            this[property] = val;
        },
        resetForm () {
            this.username = '';
            this.password = '';
            this.invite = '';
        },
        async login () {
            if (this.username.length <= 0 || this.password.length <= 0) {
                this.resetForm();
                this.error = 'Please fill out all the fields.';
            } else {
                const res = await this.$axios.post('http://localhost:3000/auth/login', {
                    username: this.username,
                    password: this.password,
                }, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    window.location.href = 'http://localhost:3001/dashboard';
                } else {
                    this.resetForm();
                    this.error = res.data.message;
                }
            }
        },
        async register () {
            if (this.username.length <= 0 || this.password.length <= 0 || this.invite.length <= 0) {
                this.resetForm();
                this.error = 'Please fill out all the fields.';
            } else {
                const res = await this.$axios.post('http://localhost:3000/auth/register', {
                    username: this.username,
                    password: this.password,
                    invite: this.invite,
                }, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    window.location.href = 'http://localhost:3001/dashboard';
                } else {
                    this.resetForm();
                    this.error = res.data.message;
                }
            }
        },
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
      margin 5px 0px
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
      margin-top 21px
      padding: 0px
      font-size .7rem
      a
        color getColor('primary') !important
        margin-left 6px
        &:hover
          text-decoration underline
</style>
