<template>
  <header>
    <div
      class="bg-gradient-to-r to-topColor-left from-topColor-right w-full h-16 px-8 flex items-center justify-center"
    >
      <div class="flex items-center justify-between w-full max-w-1200">
        <div class="flex items-center">
          <InnerLink
            :href="'/'"
            class="flex"
            :focus-on="false"
            :show-underline="false"
          >
            <img src="/images/skyticket_HMW.png" class="h-7 -mb-4px" />

            <p class="whitespace-no-wrap text-white text-lg font-bold ml-3">
              {{ $t('global.systemName') }}
            </p>
          </InnerLink>
          <InnerLink
            :show-underline="false"
            :href="'/facility'"
            text-color="text-white"
            class="ml-3 font-hairline hover:underline"
            :focus-on="false"
          >
            <p class="truncate max-w-500px">
              {{ currentHotelName }}
            </p>
          </InnerLink>
          <Tag
            v-show="currentHotelName && currentHotelPriority"
            color="yellow"
            class="ml-2"
          >
            <p class="px-2 py-0.5">{{ $t('global.header.systemLinkage') }}</p>
          </Tag>
          <Tag v-show="currentHotelName && !currentHotelPriority" class="ml-2">
            <p class="px-2 py-0.5">{{ $t('global.header.systemNonPublic') }}</p>
          </Tag>
          <OuterLink
            v-show="currentHotelName && currentHotelPriority"
            :href="hotelHref"
            :target="'_blank'"
            class="ml-3 text-white"
          >
            <p class="truncate max-w-500px">
              {{ $t('global.header.hotelLink') }}
            </p>
          </OuterLink>
        </div>
        <div class="flex items-center">
          <div v-show="currentUserName" class="relative">
            <div
              class="bg-white bg-opacity-20 rounded-2xl p-0.5 px-3 cursor-pointer hover:bg-opacity-40"
            >
              <p class="text-white font-400" @click="toggleUserInfo">
                {{ currentUserName }}
              </p>
            </div>
            <UserInformation
              v-show="isShowUserInfo"
              :user-info="getUserInformation"
              :close-user-info="toggleUserInfo"
            />
          </div>
          <IconBtn
            class="ml-6"
            color="text-white"
            hover-color="text-yellow"
            :icon="exitToApp"
            @click="logout"
          />
        </div>
      </div>
    </div>
    <Menu
      :menu-tabs="menutabs"
      btn-width="w-48"
      :active-tab-key="menuActiveKey"
    />
  </header>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { mdiHelpCircleOutline, mdiExitToApp } from '@mdi/js'
import { accountStore } from '~/store'
import { Account } from '~/types'
import { getHeaderList } from '~/utils/pageStructure'

@Component({
  components: {
    Tag: () => import('~/components/atoms/Tag.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Menu: () => import('~/components/molecules/Menu.vue'),
    InnerLink: () => import('~/components/atoms/InnerLink.vue'),
    OuterLink: () => import('~/components/atoms/OuterLink.vue'),
    UserInformation: () => import('~/components/molecules/UserInformation.vue'),
  },
})
export default class extends Vue {
  private activeKey: string = ''
  private helpCircleOutline: string = mdiHelpCircleOutline
  private exitToApp: string = mdiExitToApp
  private isShowUserInfo: boolean = false
  private menutabs = getHeaderList(
    this.$i18n,
    accountStore.wholesalerId,
    accountStore.isParentAccount
  )

  get currentHotelName(): string {
    return accountStore.activeFacilityInfo.name
  }

  get menuActiveKey(): string {
    return accountStore.activeMenu
  }

  get currentHotelPriority(): boolean {
    return accountStore.activeFacilityInfo.dispPriority
  }

  get currentUserName(): string {
    return accountStore.activeUsername
  }

  get getUserInformation(): Account.UserInformation {
    return accountStore.userInformation
  }

  get isLinked(): boolean {
    return accountStore.activeFacility.dispPriority
  }

  get propertyId(): number {
    return accountStore.activeFacilityInfo.propertyId
  }

  get hotelHref(): string {
    return `${this.$config.baseURL}${this.propertyId}`
  }

  private async logout(): Promise<void> {
    await accountStore.logout()
    this.$router.push('/login')
  }

  private toggleUserInfo(): void {
    this.isShowUserInfo = !this.isShowUserInfo
  }
}
</script>
