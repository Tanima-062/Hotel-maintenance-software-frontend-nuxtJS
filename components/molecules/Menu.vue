<template>
  <div class="w-full shadow h-11 bg-menuColor flex items-center justify-center">
    <transition-group
      class="w-full max-w-1200 flex items-center z-30"
      name="menu-drop"
      tag="div"
    >
      <div
        v-for="item in menuTabs"
        :key="item.key"
        tag="div"
        class="relative"
        @mouseleave="setHoverBtnKey('')"
      >
        <MenuBtn
          class="py-3"
          :value="item.key"
          :class="activeStyle(item.key)"
          :is-active="isActive(item.key)"
          color="text-menu"
          @mouseover="setHoverBtnKey(item.key)"
          @click="onClick"
        >
          {{ item.name }}
        </MenuBtn>
        <div
          v-if="isHoverTabKey === item.key"
          class="absolute origin-top mt-3px"
          :class="btnWidth"
        >
          <ul
            class="border border-t-0 border-bdColor border-solid bg-menuColor w-full menuItem-area text-center"
          >
            <li
              v-for="(liItem, liItemIndex) in item.items"
              :key="liItemIndex"
              class="p-3 text-sm hover:text-menuColor-active"
              :class="`
                ${liItemIndex > 0 && 'border-t border-bdColor border-solid'} ${
                liItem.href === $route.path &&
                'text-menuColor-active font-normal'
              }
              `"
            >
              <InnerLink
                :href="liItem.href"
                :show-underline="false"
                hover-text-color="text-menuColor-active"
                :focus-on="false"
              >
                {{ liItem.name }}
              </InnerLink>
            </li>
          </ul>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component({
  components: {
    MenuBtn: () => import('~/components/atoms/MenuBtn.vue'),
    InnerLink: () => import('~/components/atoms/InnerLink.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [], required: true })
  menuTabs!: Object[]

  @Prop({ default: 'w-40' })
  btnWidth!: string

  @Prop({ default: '' })
  activeTabKey!: string

  private isHoverTabKey: string = ''

  private focusTabItemStyle(liItemIndex: number): string {
    const classList = []
    if (!liItemIndex) {
      classList.push('border-t border-bdColor border-solid')
    }
    classList.push(this.btnWidth)
    return classList.join(' ')
  }

  private activeStyle(tabKey: string): string {
    const classList = []
    classList.push(this.btnWidth)
    if (this.isActive(tabKey)) {
      classList.push('border-b-3 border-solid border-menuColor-active -mb-3px')
    }
    return classList.join(' ')
  }

  private isActive(tabKey: string): boolean {
    return this.activeTabKey === tabKey || this.isHoverTabKey === tabKey
  }

  private setHoverBtnKey(v: string): void {
    this.isHoverTabKey = v
  }

  @Emit()
  private onClick(e: Event & { target: HTMLInputElement }): string {
    return e.target.value
  }
}
</script>
<style lang="sass" scoped>
.anim
  transition: all .3s ease

.menu-drop-enter-active, .menu-drop-leave-active
  transition: opacity .5s

.menu-drop-enter, .menu-drop-leave-to
  opacity: 0

.menuItem-area
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
</style>
