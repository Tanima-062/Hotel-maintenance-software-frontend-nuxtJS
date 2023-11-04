<template>
  <ValidationObserver v-slot="{ handleSubmit, invalid, errors }">
    <div class="border border-solid border-bdColor table p-0 mb-6 w-full">
      <div class="table-row-group">
        <div class="table-row">
          <div class="table-cell bg-menuColor pt-4 pl-4">
            <p class="text-black-dark whitespace-no-wrap">
              {{ $t('settlement.label.destination') }}
            </p>
          </div>
          <div class="table-cell p-4">
            <validation-provider
              vid="settlement-addressee"
              tag="div"
              rules="required"
            >
              <InputText
                :id="'settlement-addressee'"
                v-model="settlementInfoData.addressee"
                maxlength="50"
                :placeholder="$t('settlement.label.destination')"
                class="w-full"
              />
            </validation-provider>
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
        <div class="table-cell bg-menuColor pt-4 pl-4">
          <p class="text-black-dark whitespace-no-wrap">
            {{ $t('settlement.label.invoiceNumber') }}
          </p>
        </div>
        <div class="table-cell p-4">
          <validation-provider
            vid="invoice-number"
            tag="div"
            :name="$t('settlement.label.invoiceNumber')"
            class="w-full"
          >
            <InputText
              :id="'invoice-number'"
              v-model="settlementInfoData.invoiceNumber"
              maxlength="14"
              :placeholder="$t('settlement.label.invoiceNumber')"
              class="w-full"
            />
          </validation-provider>
            <div
              v-if="showErrorCharacterMessages(errors).length"
            >
              <ErrorText
                v-for="(errorText, index) in showErrorCharacterMessages(errors)"
                :key="index"
                :err-text="errorText"
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
          <p class="text-black-dark">{{ $t('settlement.label.bankInfo') }}</p>
        </div>
        <div class="table-cell px-4 pt-4 pb-2">
          <div class="flex flex-row space-x-8">
            <div class="flex flex-col w-84">
              <label class="text-black-light mb-1 ml-2">{{
                $t('settlement.label.bankName')
              }}</label>
              <AutoComplete
                class="w-full"
                :on-input-handler="onInputBankName"
                :on-key-down-handler="onKeyDownBankName"
                :on-leaved-handler="onLeavedBank"
                :items="availableBankName"
                :value="bankValue"
              />
            </div>
            <div class="flex flex-col w-84">
              <label class="text-black-light mb-1 ml-2">{{
                $t('settlement.label.bankNameRuby')
              }}</label>
              <validation-provider
                vid="bank-name-ruby"
                tag="div"
                rules="required"
              >
                <InputText
                  :id="'bank-name-ruby'"
                  v-model="settlementInfoData.bankNameRuby"
                  width="w-full"
                  :placeholder="$t('settlement.label.bankNameRuby')"
                  :disabled="true"
                />
              </validation-provider>
            </div>
            <div class="flex flex-col w-84">
              <label class="text-black-light mb-1 ml-2">{{
                $t('settlement.label.bankCode')
              }}</label>
              <InputText
                v-model="settlementInfoData.bankCode"
                width="w-full"
                :placeholder="$t('settlement.label.bankCode')"
                :disabled="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="table-row">
        <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
          <p class="text-black-dark">
            {{ $t('settlement.label.branchInfo') }}
          </p>
        </div>
        <div class="table-cell px-4 pt-4 pb-2">
          <div class="flex flex-row space-x-8">
            <div class="flex flex-col w-84">
              <label class="text-black-light mb-1 ml-2">{{
                $t('settlement.label.branchName')
              }}</label>
              <AutoComplete
                :id="'available-branch-bank'"
                class="w-full"
                :on-input-handler="onInputBranchBankName"
                :on-key-down-handler="onKeyDownBranchBankName"
                :on-leaved-handler="onLeavedBranchBank"
                :items="availableBranchBankName"
                :value="branchBankValue"
              />
            </div>
            <div class="flex flex-col w-84">
              <label class="text-black-light mb-1 ml-2">{{
                $t('settlement.label.branchNameRuby')
              }}</label>
              <validation-provider
                vid="branch-bank-name-ruby"
                tag="div"
                rules="required"
              >
                <InputText
                  :id="'branch-bank-name-ruby'"
                  v-model="settlementInfoData.bankBranchRuby"
                  width="w-full"
                  :placeholder="$t('settlement.label.branchNameRuby')"
                  :disabled="true"
                />
              </validation-provider>
            </div>
            <div class="flex flex-col w-84">
              <label class="text-black-light mb-1 ml-2">{{
                $t('settlement.label.branchCode')
              }}</label>
              <InputText
                v-model="settlementInfoData.bankBranchCode"
                width="w-full"
                :placeholder="$t('settlement.label.branchCode')"
                :disabled="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="table-row">
        <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
          <p class="text-black-dark">
            {{ $t('settlement.label.accountInfo') }}
          </p>
        </div>
        <div class="table-cell p-4">
          <div>
            <div class="flex flex-row space-x-8">
              <div class="flex flex-col w-84">
                <label class="text-black-light mb-1 ml-2">{{
                  $t('settlement.label.accountType')
                }}</label>
                <Selectbox
                  width="w-full"
                  padding="px-3 py-1.5"
                  :items="bankTypeList"
                  :active-item="activeBankType"
                  @select-item="selectedBankType"
                />
              </div>
              <validation-provider
                vid="account-number"
                tag="div"
                rules="required|numeric"
                :name="$t('settlement.label.accountNumber')"
                class="w-full"
              >
                <div class="flex flex-col w-84">
                  <label class="text-black-light mb-1 ml-2">{{
                    $t('settlement.label.accountNumber')
                  }}</label>
                  <InputText
                    :id="'account-number'"
                    v-model="settlementInfoData.bankAccountNumber"
                    width="w-full"
                    :placeholder="$t('settlement.label.accountNumber')"
                  />
                </div>
                <ErrorText
                  :err-text="
                    !!errors['account-number'] &&
                    errors['account-number'].length > 0
                      ? errors['account-number'][0]
                      : ''
                  "
                />
              </validation-provider>
              <validation-provider
                vid="account-holder"
                tag="div"
                rules="required|account-holder"
                :name="$t('settlement.label.accountHolder')"
                class="w-full"
              >
                <div class="flex flex-col w-84">
                  <label class="text-black-light mb-1 ml-2">{{
                    $t('settlement.label.accountHolder')
                  }}</label>
                  <InputText
                    :id="'account-holder'"
                    v-model="settlementInfoData.bankAccountHolder"
                    width="w-full"
                    :placeholder="$t('settlement.label.accountHolder')"
                  />
                  <p v-show="errors.length">{{ errors[0] }}</p>
                </div>
                <ErrorText
                  :err-text="
                    !!errors['account-holder'] &&
                    errors['account-holder'].length > 0
                      ? errors['account-holder'][0]
                      : ''
                  "
                />
              </validation-provider>
            </div>
            <p class="ml-2 mt-1 text-black-light3">
              {{ $t('settlement.label.accountNavigation') }} <br />
              <a
                href="/pdf/settlement_account_name_rule.pdf"
                target="”_blank”"
                rel="noopener"
                class="text-btnColor"
              >
                {{ $t('settlement.label.accountNavigationLink') }}
              </a>
            </p>
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
        <div class="table-cell bg-menuColor pt-4 pl-4">
          <p class="text-black-dark">{{ $t('settlement.label.emails') }}</p>
        </div>
        <div class="table-cell p-4">
          <div
            v-for="(item, index) in settlementInfoData.emails"
            :key="index"
            class="flex flex-row space-x-4"
            :class="index < settlementInfoData.emails.length - 1 && 'mb-4'"
          >
            <validation-provider
              :vid="`email-${index}`"
              tag="div"
              rules="required|email"
              :name="$t('settlement.email')"
              class="w-full"
            >
              <InputText
                v-model="settlementInfoData.emails[index]"
                :placeholder="$t('settlement.placeholder.newEmail')"
                class="w-full"
                :error="
                  errors[`email-${index}`] && errors[`email-${index}`].length
                "
              />
            </validation-provider>
            <IconBtn
              :icon="icon.close"
              :round="true"
              :icon-width="14"
              :icon-height="14"
              padding="p-1"
              color="text-white"
              bg-color="bg-btnColor-border"
              class="mt-2"
              @click="removeEmailByPos(index)"
            />
          </div>
          <div
            v-if="settlementInfoData.emails.length < settlementMaxEmail"
            class="ml-2 flex flex-row items-center space-x-4"
            :class="settlementInfoData.emails.length > 0 && 'mt-1'"
          >
            <Btn
              color="none"
              text-color="text-btnColor"
              class="items-center select-none flex flex-row mr-4"
              :is-not-focus-line="true"
              @click="addEmail"
              ><Icon
                :icon="icon.plus"
                :round="true"
                :icon-width="15"
                :icon-height="15"
                color="text-btnColor"
              />{{ $t('settlement.label.addEmail') }}</Btn
            >
          </div>
          <div
            v-if="showErrorMessages(errors).length"
            :class="
              settlementInfoData.emails.length === settlementMaxEmail && 'mt-2'
            "
          >
            <ErrorText
              v-for="(errorText, index) in showErrorMessages(errors)"
              :key="index"
              :err-text="errorText"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center mt-8 mb-6 w-full">
      <Btn
        color="blue"
        class="w-60"
        height="big"
        type="button"
        :is-disabled="invalid || isDuplicatedEmail || isIncorrectCharacter"
        @click="handleSubmit(saveSettlementInfo)"
      >
        {{ $t('settlement.saveButton') }}
      </Btn>
    </div>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiClose, mdiPlus } from '@mdi/js'
import { SETTLEMENT_MAX_EMAIL } from '~/utils/const'
import { Global, Settlement } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    InputText: () => import('~/components/atoms/InputText.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    AutoComplete: () => import('~/components/molecules/AutoComplete.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Badge: () => import('~/components/molecules/Badge.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
  },
})
export default class extends Vue {
  @Prop({ required: true })
  settlementInfo!: Settlement.Info

  @Prop({ required: true })
  availableBank!: Settlement.AvailableBank[]

  @Prop({ required: true })
  availableBranchBank!: Settlement.AvailableBank[]

  @Prop({ required: true })
  selectedBank!: Settlement.AvailableBank

  @Prop({ required: true })
  selectedBranchBank!: Settlement.AvailableBank

  private icon: { [key: string]: string } = {
    close: mdiClose,
    plus: mdiPlus,
  }

  private settlementMaxEmail = SETTLEMENT_MAX_EMAIL
  private emailErrors: boolean[] = []
  private bankTypeList: Global.SelectboxItem[] = [
    {
      name: this.$t('settlement.type.saving') as string,
      value: this.$t('settlement.type.saving') as string,
    },
    {
      name: this.$t('settlement.type.checking') as string,
      value: this.$t('settlement.type.checking') as string,
    },
  ]

  private inputSettlementInfo: Settlement.Info = this.settlementInfo

  private activeBankType: Global.SelectboxItem = this.bankTypeList[0]
  private bankValue: string = this.settlementInfo.bankName
  private branchBankValue: string = this.settlementInfo.bankBranch

  private addEmail(): void {
    if (this.inputSettlementInfo.emails.length < this.settlementMaxEmail) {
      this.inputSettlementInfo.emails.push('')
    }
  }

  private removeEmailByPos(position: number): void {
    this.inputSettlementInfo.emails.splice(position, 1)
  }

  private selectedBankType(v: number | string): void {
    this.activeBankType =
      this.bankTypeList.find(
        (type: Global.SelectboxItem) => type.value === v
      ) || this.activeBankType
  }

  // メールアドレスの重複を確認
  get isDuplicatedEmail(): boolean {
    let isDuplicate = false
    this.inputSettlementInfo.emails.map((email) => {
      const checkDupl = this.inputSettlementInfo.emails.filter(
        (checkEmail) =>
          email === checkEmail && email !== '' && checkEmail !== ''
      )
      if (checkDupl.length >= 2) isDuplicate = true
    })
    return isDuplicate
  }

  // インボイス登録番号が不正なフォーマットかを確認
  get isIncorrectCharacter(): boolean {
    let isIncorrect = false
    const regexPattern = /^T\d{13}$/
    if (!regexPattern.test(this.inputSettlementInfo.invoiceNumber) && this.inputSettlementInfo.invoiceNumber) {
      isIncorrect = true
    }
    return isIncorrect
  }

  get availableBankName(): string[] {
    if (!this.availableBank || this.availableBank.length === 0) {
      return []
    }

    return this.availableBank.map((i) => {
      return i.bankName
    })
  }

  get availableBranchBankName(): string[] {
    if (!this.availableBranchBank || this.availableBranchBank.length === 0) {
      return []
    }

    return this.availableBranchBank.map((i) => {
      return i.bankName
    })
  }

  private showErrorMessages(errors: { [key: string]: string[] }): string[] {
    const errorMessages: string[] = []
    for (
      let index = 0;
      index < this.inputSettlementInfo.emails.length;
      index++
    ) {
      if (errors[`email-${index}`] && errors[`email-${index}`].length) {
        if (!errorMessages.includes(errors[`email-${index}`][0]))
          errorMessages.push(errors[`email-${index}`][0])
      }
    }
    if (this.isDuplicatedEmail) {
      errorMessages.push(this.$t('settlement.duplicated') as string)
    }
    return errorMessages
  }

  private showErrorCharacterMessages(errors: { [key: string]: string[] }): string[] {
    const errorMessages: string[] = []
    if (this.isIncorrectCharacter) {
      errorMessages.push(this.$t('settlement.incorrect') as string)
    }
    return errorMessages
  }

  get settlementInfoData(): Settlement.Info {
    if (this.settlementInfo.bankAccountType) {
      this.activeBankType = {
        name: this.settlementInfo.bankAccountType,
        value: this.settlementInfo.bankAccountType,
      }
    } else {
      this.activeBankType = this.bankTypeList[0]
    }

    // 銀行の更新
    if (this.selectedBank) {
      this.inputSettlementInfo.bankName = this.selectedBank.bankName
      this.inputSettlementInfo.bankNameRuby = this.selectedBank.bankNameKana
      this.inputSettlementInfo.bankCode = (
        '0000' + this.selectedBank.bankId
      ).slice(-4)
    }
    // 支店の更新
    if (this.selectedBranchBank) {
      this.inputSettlementInfo.bankBranch = this.selectedBranchBank.bankName
      this.inputSettlementInfo.bankBranchRuby = this.selectedBranchBank.bankNameKana
      this.inputSettlementInfo.bankBranchCode = (
        '000' + this.selectedBranchBank.branchBankId
      ).slice(-3)
    }

    return this.inputSettlementInfo
  }

  private saveSettlementInfo(): void {
    if (!this.isDuplicatedEmail && !this.isIncorrectCharacter) {
      this.updateSettlementInfo()
    }
  }

  private onKeyDownBankName(): void {}

  private onKeyDownBranchBankName(
    e: Event & { target: HTMLInputElement } & { keyCode: number }
  ): void {
    if (this.isDeleteKey(e.keyCode)) {
      this.inputSettlementInfo.bankBranchRuby = ''
      this.inputSettlementInfo.bankBranchCode = ''
    }
  }

  private isDeleteKey(keyCode: number): boolean {
    const BACKSPACE_KEYCODE = 8
    const DELETE_KEYCODE = 46

    return keyCode === BACKSPACE_KEYCODE || keyCode === DELETE_KEYCODE
  }

  @Emit()
  private updateSettlementInfo(): Settlement.Info {
    this.inputSettlementInfo.bankAccountType = this.activeBankType
      .value as string
    return this.inputSettlementInfo
  }

  @Emit()
  private onLeavedBank(e: Event & { target: HTMLInputElement }): Event {
    return e
  }

  @Emit()
  private onLeavedBranchBank(e: Event & { target: HTMLInputElement }): Event {
    return e
  }

  @Emit()
  private onInputBankName(
    e: Event & { target: HTMLInputElement } & { keyCode: number },
    target: string = ''
  ): string {
    this.branchBankValue = ''
    this.inputSettlementInfo.bankNameRuby = ''
    this.inputSettlementInfo.bankCode = ''
    this.inputSettlementInfo.bankBranchRuby = ''
    this.inputSettlementInfo.bankBranchCode = ''

    this.bankValue = target.length ? target : e.target.value
    return this.bankValue
  }

  @Emit()
  private onInputBranchBankName(
    e: Event & { target: HTMLInputElement },
    target: string = ''
  ): string {
    this.branchBankValue = target.length ? target : e.target.value
    return this.branchBankValue
  }

  mounted() {
    this.inputSettlementInfo = JSON.parse(JSON.stringify(this.settlementInfo))
  }
}
</script>
