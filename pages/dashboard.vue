<template>
  <div class="header">
    <div v-if="!loading">
      <h1>Dashboard Page</h1>
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            loading: true,
            user: {},
        };
    },
    created () {
        if (process.client) {
            const spinner = this.$vs.loading({
                background: '#050506',
            });
            this.$axios.get('http://localhost:3000/users/@me', { withCredentials: true })
                .then((res) => {
                    if (res.data) {
                        setTimeout(() => {
                            spinner.close();
                            this.loading = false;
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            spinner.close();
                            this.$router.push('/');
                        }, 1000);
                    }
                }).catch(() => {
                    setTimeout(() => {
                        spinner.close();
                        this.$router.push('/');
                    }, 1000);
                });
        } else {
            this.$router.push('http://localhost:3001');
        }
    },
};
</script>
