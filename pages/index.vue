<template>
  <div class="container">
    <vs-navbar
      v-model="active"
      center-collapsed
      square
      color="#151515"
      class="navbar"
    >
      <template #left>
        <img src="~/assets/logo.png" width="100px" alt="logo">
        <vs-navbar-group>
          Docs
          <template #items>
            <vs-navbar-item id="guide" :active="active == 'guide'">
              Guide
            </vs-navbar-item>
            <vs-navbar-item id="docs" :active="active == 'docs'">
              Documents
            </vs-navbar-item>
            <vs-navbar-item id="components" :active="active == 'components'">
              Components
            </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-group>
          Ecosystem

          <template #items>
            <h5 class="title">
              Social
            </h5>

            <vs-navbar-item id="Github" :active="active == 'Github'">
              Github
            </vs-navbar-item>
            <vs-navbar-item id="Discord" :active="active == 'Discord'">
              Discord
            </vs-navbar-item>
            <vs-navbar-item id="Twitter" :active="active == 'Twitter'">
              Twitter
            </vs-navbar-item>
            <vs-navbar-item id="Medium" :active="active == 'Medium'">
              Medium
            </vs-navbar-item>
          </template>
        </vs-navbar-group>

        <vs-navbar-item id="License" :active="active == 'License'">
          License
        </vs-navbar-item>
      </template>

      <template #right>
        <vs-button flat>
          Login
        </vs-button>
        <vs-button>Get Started</vs-button>
      </template>
    </vs-navbar>
    <h1>
      hi
    </h1>
  </div>
</template>

<style>
.container {
  color: rgb(233, 233, 233);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

</style>
