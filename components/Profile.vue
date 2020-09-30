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
          >
            Wipe Images
          </vs-button>
          <vs-button
            size="large"
            style="width: 150px"
          >
            Relink Discord
          </vs-button>
          <vs-button
            size="large"
            style="width: 150px"
          >
            Delete Account
          </vs-button>
        </div>
        <div style="padding-bottom: 20px" />
      </div>
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
};
</script>
