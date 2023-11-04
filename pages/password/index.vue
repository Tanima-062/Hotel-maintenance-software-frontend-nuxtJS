<template>
  <ChangePassword :change-password="changePassword" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { accountStore } from '~/store'
import { Account } from '~/types'

@Component({
  layout: 'BeforeLogin',
  components: {
    ChangePassword: () => import('~/components/organisms/ChangePassword.vue'),
  },
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.password') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private async changePassword({
    userId,
    oldPassword,
    newPassword,
  }: Account.ChangePassword): Promise<boolean> {
    return await accountStore.changePassword({
      userId,
      oldPassword,
      newPassword,
    })
  }
}
</script>
