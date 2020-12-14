<template>
  <!-- App Bar Component -->
  <v-app-bar app height="90%">
    <!-- Logo Image -->
    <img
      alt="The Coding Insight Logo"
      src="/logo.svg"
      class="elevation-2 logo"
      @click="navigateToHome()"
    >

    <!-- Used spacer to go to extreme right -->
    <v-spacer />

    <!-- Not server rendered -->
    <client-only>
      <!-- Displays 'Join Us' button, if no user is signed in-->
      <v-btn v-if="currentUser == null" color="primary" @click="navigateToSignUp()">
        Join Us
      </v-btn>

      <!-- Displays user avatar with menu on click, if user is signed in-->
      <template v-else>
        <v-menu
          v-model="menu"
          bottom
          left
          close-on-content-click
          offset-y
          transition="slide-y-transition"
        >
          <!-- User menu activator (on click) -->
          <template v-slot:activator="{ on }">
            <!-- User avatar (also an activator for the menu) -->
            <v-avatar style="cursor: pointer;" @click="menu = true; selected = null;" v-on="on">
              <v-img :src="currentUser.photoURL" :alt="currentUser.displayName" />
            </v-avatar>
          </template>

          <!-- User menu -->
          <v-list class="py-0">
            <!-- displays user avatar, full name and email (not selectable)-->
            <v-list-item class="pl-0 py-2">
              <v-list-item-avatar>
                <img :src="currentUser.photoURL" :alt="currentUser.displayName">
              </v-list-item-avatar>

              <span class="ml-n1">
                <v-list-item-title
                  v-if="currentUser.displayName"
                  class="font-weight-bold pb-1"
                >{{ currentUser.displayName }}</v-list-item-title>
                <v-list-item-subtitle v-if="currentUser.email">{{ currentUser.email }}</v-list-item-subtitle>
              </span>
            </v-list-item>
            <v-divider />
            <!-- menu options -->
            <v-list-item-group v-model="selected">
              <!-- Navigates to My Profile -->
              <v-list-item @click="navigateToProfile()">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    My Profile
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
              <!-- Signs Out current user -->
              <v-list-item @click="signOutUser()">
                <v-list-item-content>
                  <v-list-item-title>Sign Out</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>
    </client-only>
  </v-app-bar>
</template>

<script>
import ClientOnly from 'vue-client-only'
import getFirebase from '~/plugins/firebase'

export default {
  name: 'AppBar',
  components: {
    ClientOnly
  },
  data () {
    return {
      menu: false,
      selected: null
    }
  },
  computed: {
    /**
     * Checks if currentUser is signed by using session variables
     * and returns current user data if the user is signed in; null otherwise.
     *
     * '__session' is used because it is the only session allowed by firebase.
     *
     * @returns {object} currentUser - data of the currently signed in user.
     */
    currentUser () {
      if (
        this.$cookies.get('__session') &&
        this.$cookies.get('__session') != null
      ) {
        return this.$cookies.get('__session')
      } else {
        return null
      }
    }
  },
  methods: {
    /**
     * signs out user by assigning null to '__session' and redirecting to '/signUp' route.
     */
    async signOutUser () {
      const firebase = await getFirebase()

      return firebase
        .auth()
        .signOut()
        .then(async () => {
          await this.$cookies.set('__session', null)
          window.location.replace(this.$env.baseUrl + '/signUp')
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        })
    },
    /**
     * Navigates to '/' route.
     */
    navigateToHome () {
      return this.$router.push('/')
    },
    /**
     * Navigates to '/profile' route.
     */
    navigateToProfile () {
      return this.$router.push('/profile')
    },
    /**
     * Navigates to '/signUp' route.
     */
    navigateToSignUp () {
      return this.$router.push('/signUp')
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  cursor: pointer;
  width: 64px;
  height: 63px;
  border-radius: 8.7px;
}
</style>
