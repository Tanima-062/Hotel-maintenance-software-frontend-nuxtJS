<template>
  <nuxt-link
    class="cursor-pointer focus:outline-none"
    :class="styles"
    :to="href"
  >
    <slot />
  </nuxt-link>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  href!: string

  @Prop({ default: 'default' })
  textColor!: string

  @Prop({ default: 'default' })
  hoverTextColor!: string

  @Prop({ default: true })
  showUnderline!: boolean

  @Prop({ default: true })
  focusOn!: boolean

  get styles(): string {
    const classList = []
    if (this.showUnderline) {
      classList.push('underline')
    }
    classList.push(`${this.textColor}`)
    classList.push(`hover:${this.hoverTextColor}`)
    classList.push(this.focusOn ? 'focus:shadow-outline' : 'focus:shadow-none')
    return classList.join(' ')
  }
}
</script>
