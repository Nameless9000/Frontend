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
            @change="resetSubdomain"
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
            @click="updateDomain"
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

      <div class="section" style="margin-bottom: 50px">
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
              :value="fakeLink.url !== '' ? fakeLink.url : ''"
              @input="setFakelink($event)"
            />
            <vs-button class="fakeLinkButton">
              Save url
            </vs-button>
          </div>
          <vs-switch
            v-model="embed.enabled"
            class="switch"
            style="margin-top: 5px"
          >
            Embed
          </vs-switch>
          <div v-if="embed.enabled">
            <vs-input
              v-model="embed.title"
              class="embedInput"
              placeholder="Embed title"
            />
            <vs-input
              v-model="embed.text"
              class="embedInput"
              placeholder="Embed text"
            />
            <vs-button
              :color="embed.color.hex"
              style="width: 200px; margin-left: 0px; margin-top: 7px"
              @click="embed.colorPicker = !embed.colorPicker"
            >
              Color
            </vs-button>
            <Chrome
              v-if="embed.colorPicker"
              v-model="embed.color"
            />
            <vs-button
              style="width: 150px; margin-left: 0px; margin-top: 10px"
            >
              Save embed settings
            </vs-button>
          </div>
        </div>
        <div class="divider" />
      </div>
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';

export default {
    name: 'Dashboard',
    components: {
        Chrome,
    },
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
            embed: {
                enabled: false,
                title: '',
                text: '',
                color: '',
                colorPicker: false,
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
        setFakelink (val) {
            val = val.replace(/\s/g, '-');
            this.fakeLink.url = val;
        },
        resetSubdomain () {
            this.domain.subdomain = '';
        },
        updateDomain () {
            const findDomain = this.domains.find(d => d.name === this.domain.name);
            if (findDomain) {
                if (findDomain.wildcard && this.domain.subdomain.length <= 0) {
                    this.$vs.notification({
                        duration: '6000',
                        color: 'danger',
                        position: 'top-center',
                        title: 'Invalid subdomain',
                        text: 'Please provide a subdomain, or choose a non-wildcard domain.',
                    });
                } else {
                    let type;
                    if (!findDomain.wildcard && this.domain.subdomain.length <= 0) {
                        type = 'normal';
                    } else if (findDomain.wildcard && this.domain.subdomain.length !== 0) {
                        type = 'wildcard';
                    }
                    const data = {
                        request: 'changeDomain',
                        type,
                        domain: findDomain,
                        subdomain: this.domain.subdomain,
                    };
                    this.$axios.put('http://localhost:3000/users', data, { withCredentials: true })
                        .then((res) => {
                            if (res.data.success) {
                                this.$vs.notification({
                                    duration: '6000',
                                    color: 'success',
                                    position: 'top-center',
                                    title: 'Changed domain.',
                                    text: `Changed domain to ${this.domain.subdomain !== '' ? `${this.domain.subdomain}.${this.domain.name}` : this.domain.name}.`,
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
                            this.$vs.notification({
                                duration: '6000',
                                color: 'danger',
                                position: 'top-center',
                                title: 'Error',
                                text: 'Something went wrong, please try again.',
                            });
                        });
                }
            }
        },
    },
};
</script>
