<template>
  <div class="h-full relative">
    <Header />
    <div class="w-full h-full layout-body-minHeight max-w-1200 mx-auto mt-0">
      <Nuxt />
    </div>
    <div class="w-full min-w-1200">
      <Footer />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  components: {
    Header: () => import('~/components/organisms/Header.vue'),
    Footer: () => import('~/components/organisms/Footer.vue'),
  },
})
export default class extends Vue {}
</script>
<style lang="sass" scoped>
.layout-body-minHeight
  min-height: calc(100vh - 129.5px)
</style>
