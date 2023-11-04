<template>
  <footer
    class="px-8 flex justify-between items-center h-10 bg-menuColor border-t-2 border-solid border-bdColor"
  >
    <div class="w-full max-w-1200 m-auto flex justify-between items-center">
      <p class="text-black">©2020 ADVENTURE inc. All rights reserved.</p>
      <OuterLink href="/policy">{{ $t('global.footer.adPolicy') }}</OuterLink>
    </div>
  </footer>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  components: {
    OuterLink: () => import('~/components/atoms/OuterLink.vue'),
  },
})
export default class extends Vue {}
</script>
