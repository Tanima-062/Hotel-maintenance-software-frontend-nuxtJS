<template>
  <ValidationObserver v-slot="{ handleSubmit, errors, invalid }" tag="div">
    <div v-if="!updateLoadingStatus">
      <div class="border border-solid border-bdColor table p-0 mb-6 w-full">
        <div class="table-row-group">
          <div class="table-row">
            <div class="table-cell bg-menuColor pt-4 pl-4">
              <p class="text-black-dark">{{ $t('facility.input.name') }}</p>
            </div>
            <div class="table-cell p-4">
              <validation-provider
                tag="div"
                rules="required"
                :name="$t('facility.input.name')"
              >
                <InputText
                  v-model="facilityBaseInfoEdit.name"
                  :error="
                    errors[$t('facility.input.name')] &&
                    errors[$t('facility.input.name')].length
                  "
                  :placeholder="$t('facility.input.name')"
                  class="w-full"
                />
              </validation-provider>
              <p
                v-if="
                  errors[$t('facility.input.name')] &&
                  errors[$t('facility.input.name')].length
                "
                class="text-alert mt-3"
              >
                {{ errors[$t('facility.input.name')][0] }}
              </p>
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
                {{ $t('facility.input.addressInfo') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <validation-provider
                tag="div"
                rules="required|length:7"
                :name="$t('facility.input.post')"
              >
                <div class="mb-4 flex flex-col w-84">
                  <label class="text-black-light mb-1 ml-2">{{
                    $t('facility.input.post')
                  }}</label>
                  <InputText
                    v-model="validatePostalCode"
                    maxlength="7"
                    onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                    :error="
                      errors[$t('facility.input.post')] &&
                      errors[$t('facility.input.post')].length
                    "
                    :placeholder="$t('facility.input.post')"
                    width="w-84"
                  />
                  <p
                    v-if="
                      errors[$t('facility.input.post')] &&
                      errors[$t('facility.input.post')].length
                    "
                    class="text-alert mt-3"
                  >
                    {{ errors[$t('facility.input.post')][0] }}
                  </p>
                </div>
              </validation-provider>
              <div class="flex flex-row space-x-8">
                <validation-provider
                  tag="div"
                  rules="required"
                  :name="$t('facility.input.city')"
                >
                  <div class="flex flex-col w-84">
                    <label class="text-black-light mb-1 ml-2">{{
                      $t('facility.input.city')
                    }}</label>
                    <InputText
                      v-model="facilityBaseInfoEdit.stateProvinceName"
                      :placeholder="$t('facility.input.city')"
                      :error="
                        errors[$t('facility.input.city')] &&
                        errors[$t('facility.input.city')].length
                      "
                      width="w-full"
                    />
                    <p
                      v-if="
                        errors[$t('facility.input.city')] &&
                        errors[$t('facility.input.city')].length
                      "
                      class="text-alert mt-3"
                    >
                      {{ errors[$t('facility.input.city')][0] }}
                    </p>
                  </div>
                </validation-provider>
                <validation-provider
                  tag="div"
                  rules="required"
                  :name="$t('facility.input.municipality')"
                >
                  <div class="flex flex-col w-84">
                    <label class="text-black-light mb-1 ml-2">{{
                      $t('facility.input.municipality')
                    }}</label>
                    <InputText
                      v-model="facilityBaseInfoEdit.city"
                      :placeholder="$t('facility.input.municipality')"
                      :error="
                        errors[$t('facility.input.municipality')] &&
                        errors[$t('facility.input.municipality')].length
                      "
                      width="w-full"
                    />
                    <p
                      v-if="
                        errors[$t('facility.input.municipality')] &&
                        errors[$t('facility.input.municipality')].length
                      "
                      class="text-alert mt-3"
                    >
                      {{ errors[$t('facility.input.municipality')][0] }}
                    </p>
                  </div>
                </validation-provider>
                <div class="flex flex-col w-84">
                  <label class="text-black-light mb-1 ml-2">{{
                    $t('facility.input.address')
                  }}</label>
                  <InputText
                    v-model="facilityBaseInfoEdit.line1"
                    :placeholder="$t('facility.input.address')"
                    width="w-full"
                  />
                </div>
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
              <p class="text-black-dark">{{ $t('facility.input.contact') }}</p>
            </div>
            <div class="table-cell p-4">
              <div class="flex flex-row space-x-8">
                <div class="flex flex-col w-84">
                  <label class="text-black-light mb-1 ml-2">{{
                    $t('facility.input.tel')
                  }}</label>
                  <InputText
                    v-model="facilityBaseInfoEdit.phone"
                    :placeholder="$t('facility.input.tel')"
                    width="w-full"
                  />
                </div>
                <div class="flex flex-col w-84">
                  <label class="text-black-light mb-1 ml-2">Fax</label>
                  <InputText
                    v-model="facilityBaseInfoEdit.fax"
                    placeholder="Fax"
                    width="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-if="isConnectable" class="table-row">
            <div class="w-full border-b border-bdColor border-dotted" />
            <div class="table-cell">
              <div class="w-full border-b border-bdColor border-dotted" />
            </div>
          </div>
          <div v-if="isConnectable" class="table-row">
            <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
              <p class="text-black-dark">{{ $t('facility.input.connect') }}</p>
            </div>
            <div class="table-cell p-4 pb-6">
              <div class="flex flex-row space-x-8">
                <div class="flex flex-col w-84">
                  <label class="text-black-light mb-1 ml-2">{{
                    $t('facility.input.id')
                  }}</label>
                  <InputText
                    v-model="facilityBaseInfoEdit.connectId"
                    :placeholder="$t('facility.input.id')"
                    width="w-full"
                  />
                </div>
                <div class="relative flex flex-row items-center">
                  <div class="flex flex-col w-84">
                    <label class="text-black-light mb-1 ml-2">{{
                      $t('facility.input.pswd')
                    }}</label>
                    <InputText
                      v-model="facilityBaseInfoEdit.connectPassword"
                      :type="showPswdStatus ? 'text' : 'password'"
                      :placeholder="$t('facility.input.pswd')"
                      padding="py-2 pr-12"
                      width="w-full"
                      :class="!showPswdStatus && 'tracking-pswd'"
                    />
                  </div>
                  <div
                    class="mr-3 pt-10 -mt-0.5 absolute top-0 right-0"
                    @mousedown="changePswdStatus"
                    @mouseup="changePswdStatus"
                  >
                    <IconBtn
                      :icon="showPswdStatus ? eyeIcon : eyeOffIcon"
                      color="black"
                      :icon-width="18"
                      :icon-height="18"
                      hover-color="black"
                    />
                  </div>
                </div>
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
              <p class="text-black-dark">{{ $t('facility.input.category') }}</p>
            </div>
            <div class="table-cell p-4">
              <p>{{ facilityBaseInfoEdit.categoryName }}</p>
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
          :is-disabled="invalid"
          @click="handleSubmit(saveFacility)"
        >
          {{ $t('facility.saveBtn') }}
        </Btn>
      </div>
    </div>
    <div v-else>
      <div class="border border-solid border-bdColor table p-0 mb-6 w-full">
        <Empty> {{ $t('facility.baseLoading') }} </Empty>
      </div>
    </div>
  </ValidationObserver>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiEyeOff, mdiEye } from '@mdi/js'
import { Facility } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    InputText: () => import('~/components/atoms/InputText.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: false })
  isConnectable!: boolean

  @Prop()
  facilityBaseInfo!: Facility.FacilityBaseInfo

  @Prop({ default: false })
  isLoadingRequest!: boolean

  @Prop()
  fetchFacilityBaseInfo!: Function

  private eyeOffIcon: string = mdiEyeOff
  private eyeIcon: string = mdiEye
  private facilityName: string = ''
  private showPswdStatus: boolean = false
  private facilityBaseInfoEdit: Facility.FacilityBaseInfo = {
    ...this.facilityBaseInfo,
  }

  get updateLoadingStatus() {
    this.facilityBaseInfoEdit = { ...this.facilityBaseInfo }
    return this.isLoadingRequest
  }

  private changePswdStatus(event: Event): void {
    this.showPswdStatus = event.type === 'mousedown'
  }

  // get,set Copy Pasteした時にハイフンをチェックする
  get validatePostalCode(): string {
    return this.facilityBaseInfoEdit.postalCode
  }

  set validatePostalCode(postalCode: string) {
    this.facilityBaseInfoEdit.postalCode = postalCode.replace(/[^0-9]/g, '')
  }

  async created() {
    await this.fetchFacilityBaseInfo()
    this.facilityBaseInfoEdit = { ...this.facilityBaseInfo }
  }

  @Emit()
  private saveFacility(): Facility.FacilityBaseInfo {
    return this.facilityBaseInfoEdit
  }
}
</script>
