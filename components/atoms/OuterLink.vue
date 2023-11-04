<template>
  <a
    class="text-black-light cursor-pointer underline focus:shadow-outline focus:outline-none"
    rel="noopener"
    :href="href"
    :target="target"
    ><slot
  /></a>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  href!: string

  @Prop({ default: '' })
  target!: string
}
</script>
