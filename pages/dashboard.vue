<template>
  <div v-if="!loading">
    <Verify v-if="user.user.discordId === null" />
    <Dashboard v-else :user="user" />
  </div>
  <div v-else class="header" />
</template>

<script>
export default {
    data () {
        return {
            loading: true,
            user: {}
        }
    },
    created () {
        if (process.client) {
            const spinner = this.$vs.loading({
                color: 'danger',
                background: '#050506'
            })
            this.$axios.get('http://localhost:3000/api/users/@me', { withCredentials: true })
                .then((res) => {
                    if (res.data) {
                        this.user = res.data
                        setTimeout(() => {
                            spinner.close()
                            this.loading = false
                        }, 800)
                    } else {
                        setTimeout(() => {
                            spinner.close()
                            this.$router.push('/')
                        }, 800)
                    }
                }).catch(() => {
                    setTimeout(() => {
                        spinner.close()
                        this.$router.push('/')
                    }, 800)
                })
        } else {
            this.$router.push('/')
        }
    }
}
</script>
