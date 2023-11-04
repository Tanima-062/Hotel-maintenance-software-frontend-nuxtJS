<template>
  <div>
    <div class="flex items-center justify-center mb-3">
      <img src="/images/skyticket_HMB.png" class="w-48" />
      <p class="ml-3 text-2xl text-black-light whitespace-no-wrap">
        {{ $t('global.systemName') }}
      </p>
    </div>
    <ValidationObserver
      v-slot="{ handleSubmit }"
      tag="div"
      class="rounded bg-white shadow py-5 px-6 content-area flex flex-col justify-center items-center opacity-9"
    >
      <form @submit.prevent="handleSubmit(clickSubmit)">
        <p class="text-black-light w-full mb-4">
          {{ $t('password.headline') }}
        </p>

        <ErrorText :err-text="errorMsg" class="w-full mb-4" />

        <InputForm
          v-model="userId"
          type="text"
          class="w-full mb-5"
          :label="$t('password.ID.label')"
          :name="$t('password.ID.label')"
          rules="required|alpha_num"
          bg="inputBack"
        />

        <InputForm
          v-model="oldPassword"
          type="password"
          class="w-full mb-5"
          :label="$t('password.oldPW.label')"
          :name="$t('password.oldPW.label')"
          rules="required|alpha_num"
          bg="inputBack"
        />

        <InputForm
          v-model="newPassword"
          type="password"
          class="w-full mb-10"
          :label="$t('password.newPW.label')"
          :name="$t('password.newPW.label')"
          rules="required|alpha_num"
          bg="inputBack"
        />

        <div class="flex items-center justify-between">
          <Btn
            class="mb-5 w-48"
            color="gray"
            height="big"
            type="button"
            @click="clickCancel"
            >{{ $t('password.cancelBtn') }}</Btn
          >

          <Btn class="mb-5 ml-3 w-48" color="blue" height="big" type="submit">{{
            $t('password.submitBtn')
          }}</Btn>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import alert from '~/mixins/alert'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    InnerLink: () => import('~/components/atoms/InnerLink.vue'),
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop()
  changePassword!: Function

  private userId: string = ''
  private oldPassword: string = ''
  private newPassword: string = ''
  private errorMsg: string = ''

  private async clickSubmit(): Promise<void> {
    const changeSuccess = await this.changePassword({
      userId: this.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    })
    if (changeSuccess) {
      this.$router.push('/login?cp=success')
    } else {
      this.errorMsg = this.$t('password.changePasswordError') as string
    }
  }

  private clickCancel(): void {
    this.userId = ''
    this.oldPassword = ''
    this.newPassword = ''
    this.errorMsg = ''
    this.$router.push('/login')
  }
}
</script>
<style lang="sass" scoped>
.content-area
  min-width: 25rem
</style>
