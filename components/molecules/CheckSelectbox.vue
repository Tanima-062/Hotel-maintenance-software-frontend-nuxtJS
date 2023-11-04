<template>
  <validation-provider
    v-slot="{ errors }"
    tag="div"
    :rules="rules"
    :name="name"
    :class="width"
  >
    <div class="relative inline-block text-left" :class="width">
      <div
        v-show="clicked"
        class="fixed top-0 left-0 w-screen h-screen z-30"
        @click.self="clicked = false"
      />
      <transition name="selectbox">
        <div
          v-show="clicked"
          class="pl-4 origin-bottom-right absolute right-0 mt-2 w-full border border-inputLength rounded-md shadow-lg bg-white z-40"
          :class="`${boxStyle}`"
        >
          <div class="py-1" role="menu">
            <Checkbox
              v-for="(item, key) in items"
              :key="key"
              :label="item.name"
              class="h-11 leading-4"
              color="black-dark2"
              :checked="item.value"
              @change="change(item)"
            />
            <p v-if="!items.length">{{ emptyText }}</p>
          </div>
        </div>
      </transition>
      <div>
        <button
          id="options-menu"
          type="button"
          class="flex items-center justify-between w-full rounded-md text-selectColor-icon"
          :class="`${width} ${padding} ${border}`"
          :error="!!errors[0]"
          aria-haspopup="true"
          aria-expanded="true"
          @click="clicked = true"
        >
          <p class="text-left">
            {{ placeholder }}
          </p>
          <Icon
            class="flex flex-wrap -mr-1 ml-2"
            :icon="downIcon"
            color="text-black"
          />
        </button>
      </div>
    </div>
    <ErrorText :err-text="errors[0]" />
  </validation-provider>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { mdiMenuDown } from '@mdi/js'
import { Global } from '~/types'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [], required: true })
  items!: Global.CheckboxItem[]

  @Prop({ default: '', required: true })
  placeholder!: string

  @Prop({ default: 'top' })
  boxPosition!: string

  @Prop({ default: '' })
  width!: string

  @Prop({ default: 'p-1' })
  padding!: string

  @Prop({ default: '' })
  maxHeight!: string

  @Prop({ default: '' })
  name!: string

  @Prop({ default: '' })
  rules!: string

  @Prop({ default: false })
  error!: boolean

  @Prop({ default: '' })
  boxHeight!: string

  @Prop({ default: '' })
  emptyText!: string

  private clicked: boolean = false
  private downIcon: string = mdiMenuDown

  get boxStyle(): string {
    const styleArray = []
    if (this.boxPosition === 'top') {
      styleArray.push('top-0')
    } else {
      styleArray.push(this.boxPosition)
    }
    if (this.boxPosition === 'bottom') {
      styleArray.push('bottom-0')
    }
    if (this.maxHeight) {
      styleArray.push(this.maxHeight)
      styleArray.push('overflow-auto')
    }
    styleArray.push(this.boxHeight)
    styleArray.push('overflow-auto')

    return styleArray.join(' ')
  }

  get border(): string {
    const selectBox = []
    selectBox.push(
      this.error
        ? 'border border-alert bg-error'
        : 'border border-solid border-bdColor bg-white'
    )
    return selectBox.join(' ')
  }

  @Emit()
  private change(item: Global.CheckboxItem): Global.CheckboxItem {
    // this.clicked = false
    item.value = !item.value
    return item
  }
}
</script>
<style lang="sass" scoped>
.selectbox-enter-active, .selectbox-leave-active
  transition: opacity .1s

.selectbox-enter, .selectbox-leave-to
  opacity: 0
</style>
