<template>
  <div class="h-screen">
    <div class="flex flex-col justify-center items-center h-full bg-menuColor">
      <transition name="login-form">
        <Nuxt />
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {}
</script>
<style lang="sass" scoped>
.login-form-enter-active, .login-form-leave-active
  transition: opacity .5s

.login-form-enter, .login-form-leave-to
  opacity: 0
</style>
