<template>
  <validation-provider
    v-slot="{ errors }"
    tag="div"
    :rules="rules"
    :name="name"
    :class="width"
  >
    <div class="relative inline-block text-left" :class="width">
      <transition name="selectbox">
        <div
          v-show="clicked"
          class="origin-bottom-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white z-10"
          :class="`${boxStyle}`"
        >
          <div class="py-1" role="menu" v-if="!isDisabled">
            <a
              v-for="(item, key) in items"
              :key="key"
              class="block px-4 py-2 text-sm text-black hover:bg-menuColor"
              :class="width"
              role="menuitem"
              @mousedown="
                isSelectFirstItem
                  ? selectedItemOption(item.value, key)
                  : selectItem(item.value) && selectItemIndex(key)
              "
            >
              {{ item.name }}
            </a>
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
          @click="clicked = !clicked"
          @blur="clicked = false"
        >
          <p
            class="text-left"
            :class="activeItem.value === 0 ? 'text-black-light' : ''"
          >
            {{ activeItem.name }}
          </p>
          <Icon
            v-if="!isDisabled"
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
  },
})
export default class extends Vue {
  @Prop({ default: false })
  isDisabled!: boolean

  @Prop({ default: [], required: true })
  items!: Global.SelectboxItem[]

  @Prop({ default: {}, required: true })
  activeItem!: Global.SelectboxItem

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

  @Prop({ default: false })
  isSelectFirstItem!: boolean

  private clicked: boolean = false
  private downIcon: string = mdiMenuDown

  get boxStyle(): string {
    const styleArray = []
    if (this.boxPosition === 'top') {
      styleArray.push('top-0')
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

  private selectedItemOption(value: number | string, index: number) {
    this.clicked = false
    this.selectItem(value)
    this.selectItemIndex(index)
  }

  @Emit()
  private selectItem(value: number | string): number | string {
    this.clicked = false
    return value
  }

  @Emit()
  private selectItemIndex(index: number): number | string {
    this.clicked = false
    return index
  }
}
</script>
<style lang="sass" scoped>
.selectbox-enter-active, .selectbox-leave-active
  transition: opacity .1s

.selectbox-enter, .selectbox-leave-to
  opacity: 0
</style>
