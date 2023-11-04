<template>
  <div class="flex items-center justify-between bg-menuColor w-full p-3">
    <slot />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component({})
export default class extends Vue {}
</script>
