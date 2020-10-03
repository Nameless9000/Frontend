<template>
  <div class="profile">
    <Navbar enabled="profile" />
    <div class="page">
      <div class="profileSection">
        <h1 class="profileTitle">
          User Profile
        </h1>

        <p class="profileFieldContainer">
          <span class="profileField">Username:</span> {{ user.user.username }}
        </p>
        <p class="profileFieldContainer">
          <span class="profileField">Discord ID:</span> {{ user.user.discordId }}
        </p>
        <p class="profileFieldContainer">
          <span class="profileField">Current Domain:</span> {{ user.settings.domain.subdomain !== null ? `${user.settings.domain.subdomain}.${user.settings.domain.name}` : user.settings.domain.name }}
        </p>
        <p class="profileFieldContainer">
          <span class="profileField">Uploads:</span> {{ user.stats.uploads }}
        </p>
        <p class="profileFieldContainer">
          <span class="profileField">Invited By:</span> {{ user.stats.invitedBy }}
        </p>
        <p class="profileFieldContainer">
          <span class="profileField">Invites:</span> {{ user.stats.invites }}
        </p>
        <p class="profileFieldContainer">
          <span class="profileField">Invited Users:</span> {{ user.stats.invitedUsers.length !== 0 ? user.stats.invitedUsers.join(', ') : 'None' }}
        </p>
        <p class="profileFieldContainer">
          <span class="profileField">Registration Date:</span> {{ user.stats.registrationDate }}
        </p>

        <div class="dangerButtons">
          <vs-button
            style="width: 150px"
            size="large"
            @click="wipeDialog=true"
          >
            Wipe Images
          </vs-button>
          <vs-button
            size="large"
            style="width: 150px"
            href="http://localhost:3000/auth/discord/link"
          >
            Relink Discord
          </vs-button>
          <vs-button
            size="large"
            style="width: 150px"
            @click="deleteDialog=true"
          >
            Delete Account
          </vs-button>
        </div>
        <div style="padding-bottom: 20px" />
      </div>

      <vs-dialog
        v-model="wipeDialog"
        width="550px"
        not-center
        blur
      >
        <template #header>
          <h4 class="not-margin">
            Are you sure you want to do this?
          </h4>
        </template>

        <div class="con-content">
          <p>
            All of your images will be deleted, already posted links will stop working.
          </p>
        </div>

        <template #footer>
          <div class="con-footer">
            <vs-button @click="wipeImages">
              Wipe Images
            </vs-button>
            <vs-button dark flat @click="wipeDialog=false">
              Cancel
            </vs-button>
          </div>
        </template>
      </vs-dialog>

      <vs-dialog
        v-model="deleteDialog"
        width="550px"
        not-center
        blur
      >
        <template #header>
          <h4 class="not-margin">
            Are you <b>really sure</b> that you want to do this?
          </h4>
        </template>

        <div class="con-content">
          <p>
            There is no going back, your account will be deleted, you will not get your invite back, <b>YOU CANNOT REVERT THIS ACTION.</b>
          </p>
        </div>

        <template #footer>
          <div class="con-footer">
            <vs-button @click="deleteAccount">
              Delete my account
            </vs-button>
            <vs-button dark flat @click="deleteDialog=false">
              Cancel
            </vs-button>
          </div>
        </template>
      </vs-dialog>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Profile',
    props: {
        user: {
            type: Object,
            default () {
                return {};
            },
        },
    },
    data () {
        return {
            wipeDialog: false,
            deleteDialog: false,
        };
    },
    methods: {
        wipeImages () {
            this.$axios.delete('http://localhost:3000/files/wipe', { withCredentials: true })
                .then((res) => {
                    this.wipeDialog = false;
                    if (res.data.success) {
                        this.$vs.notification({
                            duration: '6000',
                            color: 'success',
                            position: 'top-center',
                            title: 'Wiped images.',
                            text: 'Successfully wiped all images.',
                        });
                    } else {
                        this.$vs.notification({
                            duration: '6000',
                            color: 'danger',
                            position: 'top-center',
                            title: 'Error',
                            text: res.data.message,
                        });
                    }
                }).catch(() => {
                    this.wipeDialog = false;
                    this.$vs.notification({
                        duration: '6000',
                        color: 'danger',
                        position: 'top-center',
                        title: 'Error',
                        text: 'Something went wrong, please try again.',
                    });
                });
        },
        deleteAccount () {
            this.$axios.delete('http://localhost:3000/users/@me', { withCredentials: true })
                .then((res) => {
                    if (res.data.success) {
                        this.$router.push('/');
                    } else {
                        this.$vs.notification({
                            duration: '6000',
                            color: 'danger',
                            position: 'top-center',
                            title: 'Error',
                            text: res.data.message,
                        });
                    }
                }).catch(() => {
                    this.wipeDialog = false;
                    this.$vs.notification({
                        duration: '6000',
                        color: 'danger',
                        position: 'top-center',
                        title: 'Error',
                        text: 'Something went wrong, please try again.',
                    });
                });
        },
    },
};
</script>

<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .con-footer
    margin-top 10px
    display flex
    align-items center
    justify-content flex-end
    .vs-button
      margin 0px
      .vs-button__content
        padding 10px 30px
      ~ .vs-button
        margin-left 10px
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
    padding-bottom 0px
  .con-content
    width 100%
    p
      font-size .8rem
      padding 0px 10px
    .vs-checkbox-label
      font-size .8rem
    .vs-input-parent
      width 100%
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
    .vs-button
      margin 0px
  </style>
