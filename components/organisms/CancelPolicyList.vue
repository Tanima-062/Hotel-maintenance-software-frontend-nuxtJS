<template>
  <div>
    <div class="my-3">
      <Btn
        class="w-24"
        color="blue"
        height="small"
        type="button"
        @click="$router.push('/cancel-policy/create')"
      >
        {{ $t('cancelPolicy.policyList.addNew') }}
      </Btn>
    </div>
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-menuColor text-black-dark">
          <th class="w-8/12 py-4 border-t font-light border-b border-bdColor">
            {{ $t('cancelPolicy.policyList.policyName') }}
          </th>
          <th class="w-2/12 py-4 border-t font-light border-b border-bdColor">
            {{ $t('cancelPolicy.policyList.policyOperation') }}
          </th>
        </tr>
      </thead>
      <div class="my-2 w-full" />
      <tbody>
        <tr v-for="(cancelPolicy, index) in policyList" :key="index">
          <td class="w-10/12">
            {{ cancelPolicy.name }}
          </td>
          <td class="w-2/12">
            <div v-if="index === 0" class="flex space-x-3 justify-center">
              <IconBtn
                class="mr-3"
                :icon="icon.edit"
                color="text-white"
                bg-color="bg-btnColor"
                padding="p-1.5"
                icon-width="17.5"
                icon-height="17.5"
                @click="moveEditPage(null)"
              />
              <div class="w-8" />
            </div>
            <div v-if="index !== 0" class="flex space-x-3 justify-center">
              <IconBtn
                class="mr-3"
                :icon="icon.edit"
                color="text-white"
                bg-color="bg-btnColor"
                padding="p-1.5"
                icon-width="17.5"
                icon-height="17.5"
                @click="moveEditPage(cancelPolicy.id)"
              />
              <IconBtn
                icon="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                color="text-white"
                bg-color="bg-btnColor-red"
                padding="p-1.5"
                icon-width="17.5"
                icon-height="17.5"
                @click="onDelete(cancelPolicy.id, cancelPolicy.name)"
              />
            </div>
          </td>
          <td />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mdiCog } from '@mdi/js'
import { cancelPolicyStore } from '~/store'
import { CancelPolicy } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    Radio: () => import('~/components/atoms/Radio.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [], required: true })
  policyList!: CancelPolicy.Item[]

  @Prop({ default: () => {}, required: true })
  onDelete!: Function

  @Prop({ default: () => {}, required: true })
  setDefaultCancelPolicy!: Function

  private icon: { [key: string]: string } = {
    edit: mdiCog,
  }

  private click(cancelPolicy: CancelPolicy.Item): string | number | void {
    const defaultCancelPolicy = this.policyList.find(
      (cancel) => cancel.isDefault
    )
    if (defaultCancelPolicy && defaultCancelPolicy.id !== cancelPolicy.id)
      this.setDefaultCancelPolicy(cancelPolicy.id, cancelPolicy.name)
  }

  private moveEditPage(cancelPolicyId: number) {
    cancelPolicyStore.setCancelPolicyId(cancelPolicyId)
    this.$router.push('/cancel-policy/edit')
  }
}
</script>
