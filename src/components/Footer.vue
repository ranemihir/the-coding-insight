<template>
  <!-- Footer main container -->
  <v-footer padless class="main">
    <!-- Creator's Label -->
    <v-card-text class="text-center">
      Designed and Created by <b>Mihir Rane</b>
    </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    /**
     * Navigates to '/' route.
     */
    navigateToHome () {
      return this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  clear: both;
  position: relative;
  // margin-top: 32%;
}

.logo {
  cursor: pointer;
  height: 64px;
  width: 64px;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .content-padding{
    padding-left: 20px;
    padding-right: 20px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .content-padding{
    padding-left: 80px;
    padding-right: 80px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .content-padding{
    padding-left: 160px;
    padding-right: 160px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .content-padding{
    padding-left: 160px;
    padding-right: 160px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .content-padding{
    padding-left: 200px;
    padding-right: 200px;
  }
}

</style>
