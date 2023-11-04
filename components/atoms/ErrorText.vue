<template>
  <transition name="fade">
    <p
      v-if="!!errText"
      :class="`text-alert ${NoWrap ? 'whitespace-no-wrap' : ''}`"
    >
      {{ errText }}
    </p>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  errText!: string

  @Prop({ default: false })
  NoWrap!: boolean
}
</script>
<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity .2s

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  opacity: 0
</style>
