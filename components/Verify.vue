<template>
  <div class="container">
    <h3 class="verifyTitle">
      Thank you for registering, just one last step!
    </h3>
    <p class="verifyCaption">
      Please link your Discord account to Astral, this is to verify your identity & join the Discord server.
    </p>
    <div class="verifyButtons">
      <vs-button
        href="http://localhost:3000/auth/discord/link"
        class="button"
        size="large"
      >
        <i class="bx bxl-discord" style="margin-right: 3px; font-size" />Link account
      </vs-button>
      <vs-button
        class="button"
        size="large"
        @click="logout"
      >
        <i class="bx bx-log-out" style="margin-right: 7px; font-size: 17px" />Logout
      </vs-button>
      <vs-button class="button" @click="activate('login')">
        <i class="bx bx-log-in" style="margin-right: 5px" /> Login
      </vs-button>
    </div>
  </div>
</template>

<script>
export default {
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
  flex-direction: column;
}

.verifyTitle {
  font-weight: 500;
}

.verifyCaption {
  margin-top: 10px;
  font-size: 24px;
}

.verifyButtons {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}

.verifyButtons .button {
  height: 40px;
  width: 150px;
}
</style>
