<template>
  <div class="content-area">
    <div class="flex items-center justify-center mb-3">
      <img src="/images/skyticket_HMB.png" class="w-48" />
      <p class="ml-3 -mt-4px text-3xl text-black-light whitespace-no-wrap">
        {{ $t('global.systemName') }}
      </p>
    </div>
    <ValidationObserver
      v-slot="{ handleSubmit }"
      tag="div"
      class="rounded bg-white shadow pt-5 pb-6 px-6 flex flex-col justify-center items-center opacity-9"
    >
      <form class="w-full" @submit.prevent="handleSubmit(clickLoginSubmit)">
        <div class="flex flex-row items-center mb-4">
          <p class="text-black-light flex-grow">
            {{ $t('login.headline') }}
          </p>
          <InnerLink
            href="/password"
            text-color="text-linkColor"
            class="flex items-center justify-between"
          >
            <Icon :icon="chevronRight" color="text-linkColor" />
            {{ $t('login.pwChangeLink') }}
          </InnerLink>
        </div>

        <ErrorText :err-text="errorMsg" class="w-full mb-4" />
        <p v-if="isPwSuccess && !errorMsg" class="mb-4 text-checkboxColor">
          {{ $t('password.changePasswordSuccess') }}
        </p>

        <label class="text-black-dark">{{ $t('login.ID.label') }}</label>
        <InputForm
          v-model="userId"
          type="text"
          class="w-full mb-5 mt-2"
          label=""
          :name="$t('login.ID.label')"
          rules="required|alpha_num"
          bg="inputBack"
        />

        <label class="text-black-dark">{{ $t('login.PW.label') }}</label>
        <InputForm
          v-model="password"
          type="password"
          class="w-full mb-5 mt-2"
          label=""
          :name="$t('login.PW.label')"
          rules="required|alpha_num"
          bg="inputBack"
        />

        <div class="flex pl-1 items-center w-full">
          <Checkbox
            :checked="isEnabled"
            :label="$t('login.saveLonginInfoCheckbox')"
            @change="checkSaveLoginInfo"
          />
          <Btn color="blue" class="w-40 ml-auto" height="big" type="submit">
            {{ $t('login.button') }}
          </Btn>
        </div>
      </form>
    </ValidationObserver>
    <div class="flex flex-row mt-3 text-inputLength">
      <p class="px-1">※</p>
      <div class="flex flex-col">
        <p class="pr-2">
          {{ $t('login.pwChangeLabel') }}
        </p>
        <p>
          {{ $t('login.pwChangeLabelNext')
          }}<a class="border-b" href="mailto:client-support@adventure-inc.co.jp"
            >client-support@adventure-inc.co.jp</a
          >
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { mdiChevronRight } from '@mdi/js'
import { Account } from '~/types'
import alert from '~/mixins/alert'
import { AccountRepository } from '~/repositories'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    InnerLink: () => import('~/components/atoms/InnerLink.vue'),
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop({ required: true })
  onLogin!: Function

  @Prop()
  loginInfo!: Account.LoginInput

  private userId: string = ''
  private password: string = ''
  private isEnabled: boolean = false
  private errorMsg: string = ''
  private accountRepository = new AccountRepository()
  private chevronRight = mdiChevronRight
  private clickProof: boolean = false
  private isPwSuccess: boolean = false

  created() {
    const loginInfo = this.accountRepository.loadAccountInfo()
    this.userId = loginInfo.userId
    this.isEnabled = loginInfo.isEnabled
    this.isPwSuccess =
      !!this.$route.query.cp && this.$route.query.cp === 'success'
  }

  private checkSaveLoginInfo(v: boolean): void {
    this.isEnabled = v
  }

  private async clickLoginSubmit(): Promise<void> {
    if (this.clickProof) {
      return
    }

    this.clickProof = true
    this.$nuxt.$loading.start()

    const loginSuccess = await this.onLogin({
      userId: this.userId,
      password: this.password,
    })

    if (loginSuccess) {
      this.accountRepository.saveLoginInfo({
        userId: this.isEnabled ? this.userId : '',
        isEnabled: this.isEnabled,
      })
      this.$router.push('/')
    } else {
      this.errorMsg = this.$i18n.t('login.loginError') as string
    }
    this.$nuxt.$loading.finish()
    this.clickProof = false
  }
}
</script>
<style lang="sass" scoped>
.content-area
  width: 26.5rem
</style>
