<template>
  <LoginOrg :on-login="onLogin" :login-info="loginInfo" />
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { roomAndPlanStore, accountStore } from '~/store'
import { AccountRepository } from '~/repositories'
import { Account } from '~/types'

@Component({
  layout: 'BeforeLogin',
  components: {
    LoginOrg: () => import('~/components/organisms/Login.vue'),
  },
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.login') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  get loginInfo(): Account.UserIdInLocalStorage {
    return accountStore.loadAccountInfo()
  }

  async created() {
    await this.checkAppRevision()
    accountStore.initLogin()
    roomAndPlanStore.initLogin()
  }

  private async checkAppRevision(): Promise<void> {
    const accountRepository = new AccountRepository()
    const res = await accountRepository.isLatestAppVersion()
    if (!res) {
      // NOTE: 非推奨だが、代替案が出るまではこれで…
      // tslint:disable-next-line
      window.location.reload(true)
    }
  }

  private async onLogin({
    userId,
    password,
  }: Account.LoginInput): Promise<boolean> {
    return await accountStore.login({ userId, password })
  }
}
</script>
