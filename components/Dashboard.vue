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
        <div class="domainArea">
          <div v-if="domain.name !== ''" class="previewArea">
            <h3 class="previewText">
              Preview
            </h3>
            <vs-input
              disabled
              :value="isWildcard ? `${domain.subdomain}.${domain.name}` : domain.name"
              class="domainSelect"
            />
          </div>
          <div v-if="isWildcard" class="subdomainArea">
            <vs-input
              placeholder="Enter a subdomain"
              :value="domain.subdomain !== '' ? domain.subdomain : ''"
              @input="setInput($event, 'subdomain')"
            />
          </div>
          <vs-select
            v-model="domain.name"
            filter
            placeholder="Choose a domain"
            color="dark"
            class="domainSelect"
            style="margin-top: 10px"
          >
            <vs-option
              v-for="oneDomain in domains"
              :key="oneDomain.name"
              :label="oneDomain.name"
              :value="oneDomain.name"
            >
              {{ oneDomain.name }}
            </vs-option>
          </vs-select>
          <vs-button
            v-if="domain.name !== ''"
            color="danger"
            class="domainButton"
            size="large"
          >
            Update Domain
          </vs-button>
          <div class="divider" />
        </div>
      </div>

      <div class="section">
        <h1 class="title">
          Config Generator
        </h1>
        <p class="configTooltip">
          You only need to generate one config.
        </p>
        <vs-button
          color="danger"
          class="configButton"
          size="large"
          :href="'http://localhost:3000/config?key=' + user.user.key"
        >
          Download Config
        </vs-button>
        <div class="divider" />
      </div>

      <div class="section">
        <h1 class="title">
          Upload Preferences
        </h1>
        <div class="uploadSettings">
          <vs-switch
            v-model="showLink"
            class="switch"
          >
            Show Link
          </vs-switch>
          <vs-switch
            v-model="fakeLink.enabled"
            class="switch"
            style="margin-top: 5px"
          >
            Fake Link
          </vs-switch>
          <div v-if="fakeLink.enabled" style="display: flex; flex-direction: row">
            <vs-input
              class="fakeLinkInput"
              placeholder="Enter a url (include https://)"
              :value="domain.subdomain !== '' ? domain.subdomain : ''"
              @input="setInput($event, 'subdomain')"
            />
            <vs-button class="fakeLinkButton">
              Save url
            </vs-button>
          </div>
        </div>
        <div class="divider" />
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
            domain: {
                name: '',
                subdomain: '',
                wildcard: null,
            },
            showLink: false,
            fakeLink: {
                enabled: false,
                url: '',
            },
        };
    },
    computed: {
        isWildcard () {
            if (this.domain.name === '') {
                return false;
            } else {
                const domain = this.domains.find(d => d.name === this.domain.name);
                return !!domain.wildcard;
            }
        },
    },
    async created () {
        const res = await this.$axios.get('http://localhost:3000/domains');
        this.domains = res.data;
        this.showLink = this.user.settings.showLink;
        this.fakeLink = this.user.settings.fakeLink;
    },
    methods: {
        setInput (val, property) {
            val = val.replace(/\s/g, '-');
            this.domain[property] = val;
        },
    },
};
</script>
