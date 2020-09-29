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
};
</script>
