<template>
  <div class="container">
    <Navbar enabled="home" />
    <div class="main">
      <img
        src="~/assets/logo.png"
        width="400px"
        alt="logo"
      >
      <p class="caption">
        The superior image hosting service.
      </p>
    </div>
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

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
}

.caption {
  margin-top: -5px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px;
  text-align: center;
}

@media only screen and (max-width: 586px) {
  .main {
    margin-left: 10px;
  }
}
</style>
