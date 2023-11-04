<template>
  <ValidationObserver v-slot="{ handleSubmit, errors, invalid }">
    <div class="border border-solid border-bdColor table p-0 mb-6 w-full">
      <div class="table-row-group">
        <div v-if="isHideBackButton && !isDefault" class="table-row">
          <div class="table-cell bg-menuColor pt-4 pl-4">
            <p class="text-black-dark">
              {{ $t('cancelPolicy.label.cancelPolicyName') }}
            </p>
          </div>
          <div class="table-cell p-4">
            <div class="flex flex-row space-x-2">
              <InputForm
                v-model="newCancelPolicyName"
                label=""
                type="text"
                :name="$t('cancelPolicy.label.cancelPolicyName')"
                rules="required"
                class="w-80 text-left"
                :error-no-wrap="true"
              />
            </div>
          </div>
        </div>
        <div class="table-row">
          <div
            class="w-full"
            :class="isHideBackButton && 'border-b border-bdColor border-dotted'"
          />
          <div class="table-cell">
            <div
              class="w-full"
              :class="
                isHideBackButton && 'border-b border-bdColor border-dotted'
              "
            />
          </div>
        </div>
        <div v-show="isShowDeposit" class="table-row">
          <div class="table-cell bg-menuColor pt-4 pl-4">
            <p class="text-black-dark">
              {{ $t('cancelPolicy.label.deposit') }}
            </p>
          </div>
          <div class="table-cell p-4">
            <div class="flex flex-row space-x-2">
              <InputForm
                v-model="cancelPolicyInput.deposit"
                label=""
                type="number"
                :name="$t('cancelPolicy.label.deposit')"
                rules="required|integer|min_value:0|max_value:100"
                class="w-47 text-right"
                :text-length="3"
                :error-no-wrap="true"
                @blur="
                  cancelPolicyInput.deposit = cancelPolicyInput.deposit
                    ? cancelPolicyInput.deposit
                    : 0
                "
              />
              <p class="mt-2.5 text-black">%</p>
            </div>
          </div>
        </div>
        <div class="table-row">
          <div
            class="w-full"
            :class="isShowDeposit && 'border-b border-bdColor border-dotted'"
          />
          <div class="table-cell">
            <div
              class="w-full"
              :class="isShowDeposit && 'border-b border-bdColor border-dotted'"
            />
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('cancelPolicy.label.refund') }}
            </p>
          </div>
          <div class="table-cell p-4">
            <div class="flex flex-col">
              <label class="text-black-light3 mb-3">
                {{ $t('cancelPolicy.label.refundDesc') }}
              </label>
              <Checkbox
                :label="$t('cancelPolicy.label.noRefund')"
                :checked="cancelPolicyInput.nonRefundable === 1"
                class="w-24"
                @change="resetAdditionalCases"
              />
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('cancelPolicy.label.cancelToday') }}
            </p>
          </div>
          <div class="table-cell p-4">
            <div class="flex flex-row items-center space-x-2">
              <InputForm
                v-model="cancelPolicyInput.caseOfCancellationToday.rate"
                :disabled="cancelPolicyInput.nonRefundable === 1"
                label=""
                type="number"
                :name="$t('cancelPolicy.label.cancelToday')"
                rules="required|integer|min_value:0|max_value:100"
                class="w-47 text-right"
                :text-length="3"
                :show-error="false"
                placeholder="---"
                @blur="
                  cancelPolicyInput.caseOfCancellationToday.rate = cancelPolicyInput
                    .caseOfCancellationToday.rate
                    ? cancelPolicyInput.caseOfCancellationToday.rate
                    : 0
                "
              />
              <p class="text-black">%</p>
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('cancelPolicy.label.nowShow') }}
            </p>
          </div>
          <div class="table-cell px-4 pb-4">
            <div class="flex flex-row items-center space-x-2">
              <InputForm
                v-model="cancelPolicyInput.caseOfNoShow.rate"
                :disabled="cancelPolicyInput.nonRefundable === 1"
                label=""
                type="number"
                :name="$t('cancelPolicy.label.nowShow')"
                rules="required|integer|min_value:0|max_value:100"
                class="w-47 text-right"
                :text-length="3"
                :show-error="false"
                placeholder="---"
                @blur="
                  cancelPolicyInput.caseOfNoShow.rate = cancelPolicyInput
                    .caseOfNoShow.rate
                    ? cancelPolicyInput.caseOfNoShow.rate
                    : 0
                "
              />
              <p class="text-black">%</p>
            </div>
            <div>
              <ErrorText
                :err-text="
                  errors[$t('cancelPolicy.label.cancelToday')]
                    ? errors[$t('cancelPolicy.label.cancelToday')][0]
                    : ''
                "
              />
              <ErrorText
                :err-text="
                  errors[$t('cancelPolicy.label.nowShow')]
                    ? errors[$t('cancelPolicy.label.nowShow')][0]
                    : ''
                "
              />
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('cancelPolicy.label.condition') }}
            </p>
          </div>
          <div class="table-cell p-4">
            <div
              v-for="(item, index) in cancelPolicyInput.additionalCases"
              :key="index"
              class="ml-2 flex flex-row items-center space-x-3"
              :class="
                index < cancelPolicyInput.additionalCases.length - 1 && 'mb-5'
              "
            >
              <p class="text-black">
                {{ $t('cancelPolicy.label.stayDate') }}
              </p>
              <InputForm
                v-model="item.startDays"
                label=""
                type="number"
                :disabled="cancelPolicyInput.nonRefundable === 1"
                :name="`${index}:「${$t('cancelPolicy.label.dateFrom')}」`"
                :rules="setValidateRule(index, 'startDays')"
                class="w-18 text-right"
                :text-length="3"
                :show-error="false"
              />
              <p class="text-black">
                {{ $t('cancelPolicy.label.dateFrom') }}
              </p>
              <InputForm
                v-model="item.endDays"
                label=""
                type="number"
                :disabled="cancelPolicyInput.nonRefundable === 1"
                :name="`${index}:「${$t('cancelPolicy.label.dateUntil')}」`"
                :rules="setValidateRule(index, 'endDays')"
                class="w-18 text-right"
                :text-length="3"
                :show-error="false"
              />
              <p class="text-black">
                {{ $t('cancelPolicy.label.dateUntil') }}
              </p>
              <InputForm
                v-model="item.rate"
                label=""
                type="number"
                :disabled="cancelPolicyInput.nonRefundable === 1"
                :name="`${index}:${$t('cancelPolicy.label.percent')}`"
                :rules="setValidateRule(index, 'rate')"
                class="w-18 text-right"
                :text-length="3"
                :show-error="false"
              />
              <p class="text-black">%</p>
              <div>
                <IconBtn
                  v-if="!cancelPolicyInput.nonRefundable"
                  :icon="icon.close"
                  :round="true"
                  :icon-width="14"
                  :icon-height="14"
                  padding="p-1"
                  color="text-white"
                  bg-color="bg-btnColor-border"
                  class="ml-3"
                  @click="removeConditionByPos(index)"
                />
              </div>
            </div>
            <div
              v-if="
                cancelPolicyInput.additionalCases.length <
                  addMaxConditionPolicy && !cancelPolicyInput.nonRefundable
              "
              class="ml-3 flex flex-row items-center space-x-4"
              :class="cancelPolicyInput.additionalCases.length && 'mt-3'"
            >
              <Btn
                color="none"
                text-color="text-btnColor"
                class="items-center select-none btnColor flex flex-row mr-4"
                :is-not-focus-line="true"
                @click="addCondition"
                ><Icon
                  :icon="icon.plus"
                  :round="true"
                  :icon-width="15"
                  :icon-height="15"
                  color="text-btnColor"
                />{{ $t('cancelPolicy.button.addCondition') }}</Btn
              >
            </div>
            <div v-if="showErrorMessage(errors).length">
              <p class="text-alert mt-2">
                {{ $t('cancelPolicy.label.alert') }}
              </p>
              <p
                v-for="(errorShow, index) in showErrorMessage(errors)"
                :key="index"
                class="text-alert"
              >
                {{ errorShow }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center mt-8 mb-5 w-full">
      <Btn
        v-if="isHideBackButton"
        color="gray"
        class="w-51 m-3"
        height="big"
        @click="$router.push('/cancel-policy')"
      >
        {{ $t('cancelPolicy.policyList.goBackList') }}
      </Btn>
      <Btn
        color="blue"
        class="w-60"
        height="big"
        type="button"
        :is-disabled="invalid || isDuplicate"
        @click="
          cancelPolicyInput.nonRefundable
            ? saveCancelPolicyInput(invalid)
            : handleSubmit(saveCancelPolicyInput(invalid))
        "
      >
        {{ $t('cancelPolicy.button.saveCancelPolicy') }}
      </Btn>
    </div>
  </ValidationObserver>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiClose, mdiPlus } from '@mdi/js'
import {
  CANCELPOLICY_MAX_CONDITION,
  CANCELPOLICY_DEFAULT_CONDITION,
} from '~/utils/const'
import { CancelPolicy } from '~/types'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    InputText: () => import('~/components/atoms/InputText.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: true })
  isDefault!: boolean

  @Prop({ default: false })
  isShowDeposit!: boolean

  @Prop({ default: true })
  isHideBackButton!: boolean

  @Prop({ default: false })
  isLoadingRequest!: boolean

  @Prop({ default: null })
  cancelPolicyName!: string | null

  @Prop({ required: true })
  cancelPolicyInfo!: CancelPolicy.Settings

  @Prop({ required: true })
  saveCancelPolicy!: Function

  private icon: { [key: string]: string } = {
    close: mdiClose,
    plus: mdiPlus,
  }

  private newCancelPolicyName: string | null = ''
  private addMaxConditionPolicy = CANCELPOLICY_MAX_CONDITION
  private inputDeposit: string = '0'
  private inputCancelToday: string = '100'
  private inputNowShow: string = '100'
  private errorMessageList: string[] = []
  private isDuplicate: boolean = false
  private cancelPolicyData: CancelPolicy.Settings = this.cancelPolicyInfo

  private created(): void {
    this.newCancelPolicyName = this.cancelPolicyName
  }

  private addCondition(): void {
    if (
      this.cancelPolicyInput.additionalCases.length < this.addMaxConditionPolicy
    ) {
      this.cancelPolicyInput.additionalCases.push({
        endDays: '',
        startDays: '',
        rate: '',
      })
    }
  }

  private removeConditionByPos(position: number): void {
    this.cancelPolicyInput.additionalCases.splice(position, 1)
  }

  get cancelPolicyInput(): CancelPolicy.Settings {
    this.cancelPolicyData = JSON.parse(JSON.stringify(this.cancelPolicyInfo))
    return this.cancelPolicyData
  }

  private showErrorMessage(error: { [key: string]: string[] }): string[] {
    if (this.cancelPolicyInput.nonRefundable) return []
    const errorMessage: string[] = []
    if (this.checkDuplicate())
      errorMessage.push(this.$t('cancelPolicy.label.duplicate') as string)
    Object.entries(error).map((errorCondition) => {
      if (
        (errorCondition[0].includes(
          this.$t('cancelPolicy.label.dateFrom') as string
        ) ||
          errorCondition[0].includes(
            this.$t('cancelPolicy.label.dateUntil') as string
          ) ||
          errorCondition[0].includes(
            this.$t('cancelPolicy.label.percent') as string
          )) &&
        errorCondition[1].length
      ) {
        const message = errorCondition[1][0]
        const dividePosMessage = message.split(':')
        if (!errorMessage.includes(dividePosMessage[1])) {
          errorMessage.push(dividePosMessage[1])
        }
      }
    })
    return errorMessage
  }

  // 返金追加条件のバリデーションのルールを設定
  private setValidateRule(position: number, target: string): string {
    if (
      this.cancelPolicyInput.additionalCases.length <=
      CANCELPOLICY_DEFAULT_CONDITION
    ) {
      let checkDefaultBox = true
      for (
        let index = 0;
        index < this.cancelPolicyInput.additionalCases.length;
        index++
      ) {
        if (!this.isCheckEmptyValueByPos(index)) {
          checkDefaultBox = false
        }
      }
      if (checkDefaultBox) return ''
    }
    switch (target) {
      case 'startDays': {
        return this.cancelPolicyInput.nonRefundable
          ? ''
          : `required|integer|min_value:1|max_value:999`
      }
      case 'endDays': {
        return this.cancelPolicyInput.nonRefundable
          ? ''
          : `required|integer|min_value:1|max_value:${this.cancelPolicyInput.additionalCases[position].startDays}`
      }
      case 'rate':
        return this.cancelPolicyInput.nonRefundable
          ? ''
          : 'required|integer|min_value:0|max_value:100'
      default:
        return ''
    }
  }

  private isCheckEmptyValueByPos(position: number) {
    if (
      !this.cancelPolicyInput.additionalCases[position].startDays &&
      !this.cancelPolicyInput.additionalCases[position].endDays &&
      !this.cancelPolicyInput.additionalCases[position].rate
    ) {
      return true
    }
    return false
  }

  private checkDuplicate(): boolean {
    let duplicateStatus = false
    for (
      let indexTarget = 0;
      indexTarget < this.cancelPolicyInput.additionalCases.length;
      indexTarget++
    ) {
      const target = this.cancelPolicyInput.additionalCases[indexTarget]
      const checkDupl = this.cancelPolicyInput.additionalCases.some(
        (additional, index) =>
          indexTarget !== index &&
          target.startDays.length &&
          additional.startDays.length &&
          additional.endDays.length &&
          // Case 1 check same value of startDays and endDays
          (Number(target.startDays) === Number(additional.endDays) ||
            Number(target.startDays) === Number(additional.startDays) ||
            // Case 2 check greater than target startDays, less than endDays
            (Number(target.startDays) < Number(additional.startDays) &&
              Number(target.startDays) >= Number(additional.endDays)))
      )
      if (checkDupl) {
        duplicateStatus = true
        break
      }
    }
    this.isDuplicate = duplicateStatus
    return duplicateStatus
  }

  private resetAdditionalCases(value: boolean): void {
    if (value) {
      this.cancelPolicyInput.nonRefundable = 1
      this.cancelPolicyInput.caseOfCancellationToday.rate = this
        .cancelPolicyInput.caseOfCancellationToday.rate
        ? this.cancelPolicyInput.caseOfCancellationToday.rate
        : 100
      this.cancelPolicyInput.caseOfNoShow.rate = this.cancelPolicyInput
        .caseOfNoShow.rate
        ? this.cancelPolicyInput.caseOfNoShow.rate
        : 100
      this.cancelPolicyInput.additionalCases = []
      for (
        let index = 0;
        this.cancelPolicyInput.additionalCases.length <
        CANCELPOLICY_DEFAULT_CONDITION;
        index++
      ) {
        this.cancelPolicyInput.additionalCases.push({
          endDays: '',
          rate: '',
          startDays: '',
        })
      }
    } else {
      this.cancelPolicyInput.nonRefundable = 0
    }
  }

  private saveCancelPolicyInput(invalid: boolean): void {
    if (!invalid && !this.isDuplicate) {
      this.saveCancelPolicy(this.newCancelPolicyName, this.cancelPolicyInput)
    }
  }
}
</script>
