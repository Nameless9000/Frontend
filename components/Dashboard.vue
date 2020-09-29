<template>
  <div class="dashboard">
    <Navbar enabled="home" />
    <div class="settings">
      <div class="section" style="margin-top: 40px">
        <h1 class="title">
          Welcome {{ user.user.username }}.
        </h1>
        <div class="statsContainer">
          <div class="statsBox">
            <h1 class="statsTitle">
              <i class="bx bx-image statsIcon" />Images
            </h1>
            <p>
              You have uploaded {{ user.stats.uploads }} images.
            </p>
          </div>
          <div class="statsBox">
            <h1 class="statsTitle">
              <i class="bx bx-envelope statsIcon" />Invites
            </h1>
            <p>
              You have {{ user.stats.invites }} invites.
            </p>
          </div>
          <div class="statsBox">
            <h1 class="statsTitle">
              <i class="bx bxs-key statsIcon" />Key
            </h1>
            <p>
              Your key is <Spoiler :text="user.user.key" />
            </p>
          </div>
        </div>
      </div>

      <div class="section">
        <h1 class="title">
          Domain Preferences
        </h1>
        <!-- <vs-alert class="dashboard-error" color="success">
          Some message here.
        </vs-alert> -->
        <div class="domainArea">
          <vs-select
            v-model="domain"
            filter
            placeholder="Choose a domain"
            color="dark"
            class="domainSelect"
          >
            <vs-option
              v-for="oneDomain of domains"
              :key="oneDomain.name"
              :value="oneDomain.name"
            >
              {{ oneDomain.name }}
            </vs-option>
          </vs-select>
          <h1 v-if="domain !== ''">
            ur domain is {{ domain }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Dashboard',
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
            domains: [],
            domain: '',
        };
    },
    async created () {
        const res = await this.$axios.get('http://localhost:3000/domains');
        this.domains = res.data;
    },
};
</script>
