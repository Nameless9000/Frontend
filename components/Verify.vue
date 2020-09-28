<template>
  <div class="header">
    <h3 class="verifyTitle">
      Thank you for registering, just one last step!
    </h3>
    <p class="verifyCaption">
      Please link your Discord account to Astral, this is to verify your identity & join the Discord server.
    </p>
    <div class="verifyButtons">
      <vs-button href="http://localhost:3000/auth/discord/link" class="button" size="large" color="danger">
        <i class="bx bxl-discord" style="margin-right: 3px; font-size: 17px" />Link account
      </vs-button>
      <vs-button class="button" size="large" color="danger" @click="logout">
        <i class="bx bx-log-out" style="margin-right: 7px; font-size: 17px" />Logout
      </vs-button>
    </div>
  </div>
</template>

<script>
export default {
    methods: {
        logout () {
            this.$axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
                .then((res) => {
                    if (res.data.success) {
                        this.$router.push('/');
                    }
                }).catch(() => {
                    this.$router.push('/');
                });
        },
    },
};
</script>
