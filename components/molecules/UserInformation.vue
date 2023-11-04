<template>
  <div>
    <div
      class="fixed w-screen h-screen top-0 left-0 z-40"
      @click.self="closeUserInfo"
    ></div>
    <div
      class="userinfo-bg shadow border border-solid border-white absolute right-0 p-3 bg-white mt-2 rounded z-50"
    >
      <div class="mb-3">
        <p class="text-13px font-extralight text-black-light">
          {{ $t('global.header.userInfo.lastName') }}
        </p>
        <p class="font-normal leading-5 text-black">
          {{ userInfo.lastname }}
        </p>
      </div>
      <div class="mb-3">
        <p class="text-13px ont-extralight text-black-light">
          {{ $t('global.header.userInfo.firstName') }}
        </p>
        <p class="font-normal leading-5 text-black">
          {{ userInfo.firstname }}
        </p>
      </div>
      <div>
        <p class="text-13px text-black-light">
          {{ $t('global.header.userInfo.email') }}
        </p>
        <p class="font-normal leading-5 text-black break-words">
          {{ userInfo.email }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Account } from '~/types'

@Component
export default class extends Vue {
  @Prop({ required: true })
  userInfo!: Account.UserInformation

  @Prop({ required: true })
  closeUserInfo!: Function
}
</script>
<style lang="sass" scoped>
.userinfo-bg
  min-width: 230px
  max-width: 340px
</style>
