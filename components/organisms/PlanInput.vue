<template>
  <div>
    <ValidationObserver v-slot="{ errors, invalid }" ref="planInputRef">
      <table
        class="border border-solid border-bdColor p-0 mb-6 w-full border-collapse"
      >
        <tbody>
          <tr>
            <td class="bg-bgColor-blue pt-4 pl-4 w-60">
              <p class="text-black-dark">
                <span class="text-alert">＊</span>
                {{ $t('plan.formTitle.planName') }}
              </p>
            </td>
            <td class="pt-4 px-4">
              <InputForm
                v-model="inputData.name"
                label=""
                :show-text-length="true"
                :text-length="45"
                :maxlength="45"
                :input-text-length="inputData.name.length"
                rules="required"
                :name="$t('plan.label.planName')"
                :placeholder="$t('plan.placeholder.planName')"
              />
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60">
              <p class="text-black-dark">
                <span class="text-alert">＊</span>
                {{ $t('plan.formTitle.planCode') }}
              </p>
            </td>
            <td class="py-4 px-4">
              <InputForm
                v-model="inputData.planCode"
                label=""
                :show-text-length="true"
                :text-length="isEdit ? '50' : '20'"
                :maxlength="isEdit ? '50' : '20'"
                :input-text-length="inputData.planCode.length"
                :rules="`required${regexRulePlan}${isEdit ? '' : '|alpha_num'}`"
                :name="$t('plan.label.planCode')"
                :placeholder="$t('plan.placeholder.planCode')"
                :prevent-space="true"
                :disabled="isEdit"
              />
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark">
                <span class="text-alert">＊</span>
                {{ $t('plan.formTitle.roomForSale') }}
              </p>
            </td>
            <td class="py-4 px-4">
              <div v-if="rooms.length > 0" class="grid grid-cols-3 gap-4">
                <Checkbox
                  v-for="(room, index) in rooms"
                  :key="index"
                  :label="room.name"
                  :checked="inputData.selectedRooms.includes(room.roomTypeId)"
                  :tooltip="room.roomTypeCode"
                  class="select-none"
                  @change="checkRoom(room.roomTypeId)"
                />
              </div>
              <ErrorText
                v-if="isNotCheckingRoom"
                :err-text="$t('plan.alert.isNotSelectedRoom')"
                class="w-full mt-4"
              />
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark">
                {{ $t('plan.formTitle.planDesc') }}
              </p>
            </td>
            <div class="table-cell py-4 px-4">
              <InputTextarea
                v-model="inputData.description"
                label=""
                class="w-full"
                :placeholder="$t('plan.placeholder.planDesc')"
                :maxlength="1000"
                :text-length="1000"
                :input-text-length="inputData.description.length"
                :show-text-length="true"
                :rows="10"
              />
            </div>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark">
                {{ $t('plan.formTitle.stayMore') }}
              </p>
            </td>
            <td class="py-4 px-4">
              <p class="mb-3 text-black-light2">
                {{ $t('plan.placeholder.stayMore') }}
              </p>
              <div class="flex items-center mb-3">
                <Checkbox
                  :label="$t('plan.label.minStay')"
                  class="mr-4"
                  :checked="inputData.minStayNum > 0"
                  @change="inputData.minStayNum = $event ? 1 : 0"
                />
                <span class="text-black-light mr-1">{{
                  $t('plan.label.min')
                }}</span>
                <InputForm
                  v-model="inputData.minStayNum"
                  label=""
                  type="number"
                  rules="integer|max_value:365"
                  class="mr-1 w-23"
                  :name="$t('plan.validate.minStay')"
                  :disabled="inputData.minStayNum === 0"
                  :show-error="false"
                  @blur="
                    inputData.minStayNum =
                      inputData.minStayNum && inputData.minStayNum > 0
                        ? inputData.minStayNum
                        : 0
                  "
                />
                <span class="text-black-light">{{
                  $t('plan.label.stay')
                }}</span>
              </div>
              <div class="flex items-center">
                <Checkbox
                  :label="$t('plan.label.maxStay')"
                  class="mr-4"
                  :checked="inputData.maxStayNum > 0"
                  @change="inputData.maxStayNum = $event ? 1 : 0"
                />
                <span class="text-black-light mr-1">{{
                  $t('plan.label.max')
                }}</span>
                <InputForm
                  v-model="inputData.maxStayNum"
                  type="number"
                  label=""
                  :rules="`integer${
                    inputData.maxStayNum > 0
                      ? '|min_value:' + inputData.minStayNum
                      : ''
                  }|max_value:365`"
                  class="mr-1 w-23"
                  :name="$t('plan.validate.maxStay')"
                  :disabled="inputData.maxStayNum === 0"
                  :show-error="false"
                  @blur="
                    inputData.maxStayNum =
                      inputData.maxStayNum && inputData.maxStayNum > 0
                        ? inputData.maxStayNum
                        : 0
                  "
                />
                <span class="text-black-light">{{
                  $t('plan.label.stay')
                }}</span>
              </div>
              <div class="mt-4">
                <p
                  v-if="errors[$t('plan.validate.minStay')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.validate.minStay')][0] }}
                </p>
                <p
                  v-if="errors[$t('plan.validate.maxStay')]"
                  class="mt-1 text-alert"
                >
                  {{ errors[$t('plan.validate.maxStay')][0] }}
                </p>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-middle">
              <p class="text-black-dark">
                <span class="text-alert">＊</span>
                {{ $t('plan.formTitle.accommodationPeriod') }}
              </p>
            </td>
            <td class="p-4">
              <div class="flex">
                <RadioGroup
                  :value="inputData.isAccommodatedYearRound"
                  color="text-black"
                  :radio-items="radioItems"
                  class="flex items-center justify-between w-76 mr-3"
                  @input="checkAccommodationPeriodRadioBtn"
                />
                <div class="flex flex-col">
                  <date-picker
                    v-model="inputData.accommodationPeriodStart"
                    :format="dateFormat"
                    value-type="format"
                    :placeholder="
                      $t('plan.placeholder.accommodationPeriodStart')
                    "
                    :disabled="inputData.isAccommodatedYearRound === true"
                    :disabled-date="disabledDate"
                  />
                </div>
                <span class="mx-3 mt-2">〜</span>
                <div class="flex flex-col">
                  <date-picker
                    v-model="inputData.accommodationPeriodEnd"
                    :format="dateFormat"
                    value-type="format"
                    :placeholder="$t('plan.placeholder.accommodationPeriodEnd')"
                    :disabled="inputData.isAccommodatedYearRound === true"
                    :disabled-date="disabledDate"
                  />
                </div>
              </div>
              <div class="mt-2">
                <p
                  v-show="
                    validateDatePicker(
                      inputData.isAccommodatedYearRound,
                      inputData.accommodationPeriodStart,
                      'accommodationPeriodStart'
                    )
                  "
                  class="text-alert mb-1"
                >
                  {{ $t('plan.alert.accommodationPeriodStart') }}
                </p>
                <p
                  v-show="
                    validateDatePicker(
                      inputData.isAccommodatedYearRound,
                      inputData.accommodationPeriodEnd,
                      'accommodationPeriodEnd'
                    )
                  "
                  class="text-alert"
                >
                  {{ $t('plan.alert.accommodationPeriodEnd') }}
                </p>
                <p
                  v-show="
                    timeSeriesCheck(
                      inputData.accommodationPeriodStart,
                      inputData.accommodationPeriodEnd,
                      'accommodationPeriodSeries'
                    )
                  "
                  class="text-alert"
                >
                  {{ $t('plan.alert.accommodationPeriodSeries') }}
                </p>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-middle">
              <p class="text-black-dark">
                <span class="text-alert">＊</span>
                {{ $t('plan.formTitle.publishingPeriod') }}
              </p>
            </td>
            <td class="p-4">
              <div class="flex">
                <RadioGroup
                  v-model="inputData.isPublishedYearRound"
                  :value="inputData.isPublishedYearRound"
                  name="publishing"
                  color="text-black"
                  :radio-items="radioItems"
                  class="flex items-center justify-between w-76 mr-3"
                  @input="checkPublishedPeriodRadioBtn"
                />
                <date-picker
                  v-model="inputData.publishingStartDate"
                  :format="dateFormat"
                  value-type="format"
                  :placeholder="$t('plan.placeholder.publishingStartDate')"
                  :disabled="inputData.isPublishedYearRound === true"
                  :disabled-date="disabledDate"
                />
                <span class="mx-3 mt-2">〜</span>
                <date-picker
                  v-model="inputData.publishingEndDate"
                  :format="dateFormat"
                  value-type="format"
                  :placeholder="$t('plan.placeholder.publishingEndDate')"
                  :disabled="inputData.isPublishedYearRound === true"
                  :disabled-date="disabledDate"
                />
              </div>
              <div class="mt-2">
                <p
                  v-show="
                    validateDatePicker(
                      inputData.isPublishedYearRound,
                      inputData.publishingStartDate,
                      'publishingStartDate'
                    )
                  "
                  class="text-alert mb-1"
                >
                  {{ $t('plan.alert.publishingStartDate') }}
                </p>
                <p
                  v-show="
                    validateDatePicker(
                      inputData.isPublishedYearRound,
                      inputData.publishingEndDate,
                      'publishingEndDate'
                    )
                  "
                  class="text-alert"
                >
                  {{ $t('plan.alert.publishingEndDate') }}
                </p>
                <p
                  v-show="
                    timeSeriesCheck(
                      inputData.publishingStartDate,
                      inputData.publishingEndDate,
                      'publishingDateSeries'
                    )
                  "
                  class="text-alert"
                >
                  {{ $t('plan.alert.accommodationPeriodSeries') }}
                </p>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark mt-2">
                {{ $t('plan.formTitle.planReceipt') }}
              </p>
            </td>
            <td class="py-2 px-4">
              <div class="flex items-center py-2">
                <p class="text-black-light3 mr-7">
                  {{ $t('plan.label.receiptStart') }}
                </p>
                <span class="text-black-light mr-1">{{
                  $t('plan.label.stayDate')
                }}</span>
                <InputForm
                  v-model="inputData.reserveAcceptDate"
                  type="number"
                  label=""
                  width="w-23"
                  rules="required"
                  :name="$t('plan.label.receiptStart')"
                  :show-error="false"
                />
                <span class="text-black-light ml-1 mr-4">{{
                  $t('plan.label.dayAgo')
                }}</span>

                <div class="flex items-center justify-between w-20">
                  <Selectbox
                    box-height="h-80"
                    :items="hourList"
                    padding="py-1.5 px-3"
                    :active-item="
                      returnSelectboxItem(
                        inputData.reserveAcceptTime.split(':')[0]
                      )
                    "
                    @select-item="selectedAcceptTime($event, 0)"
                  />
                </div>
                <span class="mr-3 text-black-light">{{
                  $t('plan.label.hour')
                }}</span>
                <div class="flex items-center justify-between w-20">
                  <Selectbox
                    box-height="h-auto"
                    :items="
                      inputData.reserveAcceptTime.split(':')[0] === '24'
                        ? minuteList.slice(0, 1)
                        : minuteList
                    "
                    padding="py-1.5 px-3"
                    :active-item="
                      returnSelectboxItem(
                        inputData.reserveAcceptTime.split(':')[1]
                      )
                    "
                    @select-item="selectedAcceptTime($event, 1)"
                  />
                </div>
                <span class="text-black-light">{{
                  $t('plan.label.minute')
                }}</span>
              </div>

              <div class="flex items-center py-2">
                <p class="text-black-light3 mr-7">
                  {{ $t('plan.label.receiptEnd') }}
                </p>
                <span class="text-black-light mr-1">{{
                  $t('plan.label.stayDate')
                }}</span>
                <InputForm
                  v-model="inputData.reserveDeadlineDate"
                  label=""
                  type="number"
                  width="w-23"
                  :rules="`required${
                    inputData.reserveAcceptDate &&
                    inputData.reserveAcceptDate > 0
                      ? '|max_value:' + inputData.reserveAcceptDate
                      : ''
                  }`"
                  :name="$t('plan.label.receiptEnd')"
                  :show-error="false"
                />
                <span class="text-black-light ml-1 mr-4">{{
                  $t('plan.label.dayAgo')
                }}</span>

                <div class="flex items-center justify-between w-20">
                  <Selectbox
                    box-height="h-80"
                    :items="hourList"
                    padding="py-1.5 px-3"
                    :error="checkTimeAcceptDeadlineTime"
                    :active-item="
                      returnSelectboxItem(
                        inputData.reserveDeadlineTime.split(':')[0]
                      )
                    "
                    @select-item="selectedDeadlineTime($event, 0)"
                  />
                </div>
                <span class="mr-3 text-black-light">{{
                  $t('plan.label.hour')
                }}</span>

                <div class="flex items-center justify-between w-20">
                  <Selectbox
                    box-height="h-auto"
                    :items="
                      inputData.reserveDeadlineTime.split(':')[0] === '24'
                        ? minuteList.slice(0, 1)
                        : minuteList
                    "
                    padding="py-1.5 px-3"
                    :error="checkTimeAcceptDeadlineTime"
                    :active-item="
                      returnSelectboxItem(
                        inputData.reserveDeadlineTime.split(':')[1]
                      )
                    "
                    @select-item="selectedDeadlineTime($event, 1)"
                  />
                </div>
                <span class="mr-3 text-black-light">{{
                  $t('plan.label.minute')
                }}</span>
              </div>

              <div class="mt-1">
                <p
                  v-if="errors[$t('plan.label.receiptStart')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.receiptStart')][0] }}
                </p>
                <p
                  v-if="errors[$t('plan.label.receiptEnd')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.receiptEnd')][0] }}
                </p>
                <p v-if="checkTimeAcceptDeadlineTime" class="text-alert">
                  {{ $t('plan.alert.acceptDeadlineTime') }}
                </p>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark">
              {{ $t('plan.formTitle.checkInTime') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <TimeSelect
                  :is-add-default="true"
                  :hour-option="CheckInOutHourList"
                  :minute-option="checkInOutMinuteList"
                  :selected-time="inputData.checkInStart"
                  :error="validateCheckInTime"
                  @change="selecteTimeCheckInStart"
                />
                <span class="text-black-light ml-1 mr-4">〜</span>
                <TimeSelect
                  :is-add-default="true"
                  :hour-option="CheckInOutHourList"
                  :minute-option="checkInOutMinuteList"
                  :selected-time="inputData.checkInEnd"
                  :error="validateCheckInTime"
                  @change="selecteTimeCheckInEnd"
                />
              </div>
              <p v-if="validateCheckInTime" class="text-alert">
                {{ $t('plan.alert.checkInTime') }}
              </p>
              <p class="w-full text-sm text-right text-black-light3">
                {{ $t('plan.alert.checkInOutInfo') }}
              </p>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark">
              {{ $t('plan.formTitle.checkOutTime') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <TimeSelect
                  :is-add-default="true"
                  :hour-option="CheckInOutHourList"
                  :minute-option="checkInOutMinuteList"
                  :selected-time="inputData.checkOut"
                  :error="validateCheckOutTime"
                  @change="selecteTimeCheckOut"
                />
              </div>
              <p v-if="validateCheckOutTime" class="text-alert">
                {{ $t('plan.alert.checkOutAlertTime') }}
              </p>
              <p class="w-full text-sm text-right text-black-light3">
                {{ $t('plan.alert.checkInOutInfo') }}
              </p>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 align-top text-black-dark"
            >
              {{ $t('plan.formTitle.cancelPolicy') }}
            </td>
            <td class="py-4 px-4">
              <Selectbox
                width="min-w-97 max-w-420"
                :items="cancelPolicySelectBoxItem"
                :active-item="currentCancelPolicyItem"
                :is-select-first-item="true"
                @select-item-index="selectedCancelPolicy($event)"
              />
              <div v-if="isLoadingCancelPolicy" class="mt-4">
                <Loading />
              </div>
              <div v-if="cancelPolicyInfo && !isLoadingCancelPolicy">
                <div
                  v-if="cancelPolicyInfo.settings.nonRefundable"
                  class="mt-4"
                >
                  <Checkbox
                    :label="$t('cancelPolicy.label.noRefund')"
                    :checked="true"
                    class="w-24"
                    :disabled="true"
                  />
                </div>
                <div
                  v-if="
                    !cancelPolicyInfo.name &&
                    cancelPolicyInfo.settings.caseOfCancellationToday.rate ===
                      '' &&
                    cancelPolicyInfo.settings.caseOfNoShow.rate === ''
                  "
                  class="mt-4"
                >
                  <p class="mb-3 text-alert">
                    {{ $t('plan.placeholder.defaultCancelPolicyNoData') }}
                  </p>
                </div>
                <div
                  v-if="
                    !cancelPolicyInfo.settings.nonRefundable &&
                    cancelPolicyInfo.settings.caseOfCancellationToday.rate !==
                      '' &&
                    cancelPolicyInfo.settings.caseOfNoShow.rate !== ''
                  "
                  class="mt-4 flex flex-col space-y-2"
                >
                  <div class="flex flex-row space-x-4 items-center">
                    <p class="w-60">
                      {{ $t('cancelPolicy.label.cancelToday') }}
                    </p>
                    <p>
                      {{
                        cancelPolicyInfo.settings.caseOfCancellationToday.rate
                      }}
                      %
                    </p>
                  </div>
                  <div class="flex flex-row space-x-4 items-center">
                    <p class="w-60">
                      {{ $t('cancelPolicy.label.nowShow') }}
                    </p>
                    <p>{{ cancelPolicyInfo.settings.caseOfNoShow.rate }} %</p>
                  </div>
                  <div
                    v-for="(item, index) in cancelPolicyInfo.settings
                      .additionalCases"
                    :key="index"
                    class="ml-2 flex flex-row items-center space-x-3"
                  >
                    <p class="text-black">
                      {{ $t('cancelPolicy.label.stayDate') }}
                    </p>
                    <p>
                      {{ item.startDays }}
                    </p>
                    <p class="text-black">
                      {{ $t('cancelPolicy.label.dateFrom') }}
                    </p>
                    <p>
                      {{ item.endDays }}
                    </p>
                    <p class="text-black">
                      {{ $t('cancelPolicy.label.dateUntil') }}
                    </p>
                    <p>
                      {{ item.rate }}
                    </p>
                    <p class="text-black">%</p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark">
              {{ $t('plan.formTitle.mealOpt') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <RadioGroup
                  v-model="checkMealOption"
                  name="meal"
                  color="text-black"
                  :radio-items="isMealOption"
                  class="flex items-center justify-between w-76 mr-3"
                />
                <div class="bg-tabBgColor grid grid-cols-3 py-3 px-7">
                  <Checkbox
                    :label="$t('plan.label.mealConditionBreakfast')"
                    class="mr-3"
                    :checked="inputData.mealConditionBreakfast"
                    @change="inputData.mealConditionBreakfast = $event"
                  />
                  <Checkbox
                    :label="$t('plan.label.mealConditionLunch')"
                    class="mr-3"
                    :checked="inputData.mealConditionLunch"
                    @change="inputData.mealConditionLunch = $event"
                  />
                  <Checkbox
                    :label="$t('plan.label.mealConditionDinner')"
                    class="mr-3"
                    :checked="inputData.mealConditionDinner"
                    @change="inputData.mealConditionDinner = $event"
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 align-top text-black-dark"
            >
              {{ $t('plan.formTitle.priceClass') }}
            </td>
            <td class="py-4 px-4">
              <p class="mb-3 text-black">
                {{ $t('plan.placeholder.priceClass') }}
              </p>
              <Checkbox
                :label="$t('plan.label.oneMan')"
                :checked="true"
                :disabled="true"
              />
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 align-middle text-black-dark"
            >
              {{ $t('plan.formTitle.planTax') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <RadioGroup
                  v-model="inputData.taxCategory"
                  name="tax"
                  color="text-black"
                  :radio-items="taxRadioItems"
                  class="flex items-center justify-between w-80 mr-3"
                />
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark align-top"
            >
              {{ $t('plan.formTitle.sellStyle') }}
            </td>
            <td class="py-4 px-4">
              <p class="mb-3 text-black">
                {{ $t('plan.placeholder.sellStyle') }}
              </p>
              <div class="flex">
                <Checkbox
                  :label="$t('plan.label.isPackage')"
                  :checked="inputData.isPackage"
                  class="w-56"
                  @change="inputData.isPackage = $event"
                />
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark align-top"
            >
              {{ $t('plan.formTitle.childSet') }}
            </td>
            <td class="py-4 px-4">
              <div class="table w-full">
                <div
                  class="table-header-group bg-bgColor-light-gray text-black"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childTarget') }}
                  </div>
                  <div class="table-cell p-2 pr-40">
                    {{ $t('plan.label.acceptSet') }}
                  </div>
                  <div class="table-cell p-2 pr-8">
                    {{ $t('plan.label.adultNumberCal') }}
                  </div>
                  <div class="table-cell p-2">
                    {{ $t('plan.label.priceCal') }}
                  </div>
                  <div class="table-cell p-2">
                    {{ $t('plan.label.priceUnit') }}
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childA') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childA.receive"
                      @click="inputData.childA.receive = !!$event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childA.calcCategory"
                      @change="inputData.childA.calcCategory = $event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childA.rate"
                      label=""
                      class="w-47"
                      type="number"
                      rules="required|integer"
                      :name="$t('plan.label.childAPrice')"
                      :show-error="false"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childA.rateCategory"
                      @click="inputData.childA.rateCategory = $event"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childB') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childB.receive"
                      @click="inputData.childB.receive = !!$event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childB.calcCategory"
                      @change="inputData.childB.calcCategory = $event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childB.rate"
                      label=""
                      class="w-47"
                      type="number"
                      rules="required|integer"
                      :name="$t('plan.label.childBPrice')"
                      :show-error="false"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childB.rateCategory"
                      @click="inputData.childB.rateCategory = $event"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childC') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childC.receive"
                      @click="inputData.childC.receive = !!$event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childC.calcCategory"
                      @change="inputData.childC.calcCategory = $event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childC.rate"
                      label=""
                      class="w-47"
                      type="number"
                      rules="required|integer"
                      :name="$t('plan.label.childCPrice')"
                      :show-error="false"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childC.rateCategory"
                      @click="inputData.childC.rateCategory = $event"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childD') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childD.receive"
                      @click="inputData.childD.receive = !!$event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childD.calcCategory"
                      @change="inputData.childD.calcCategory = $event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childD.rate"
                      label=""
                      class="w-47"
                      type="number"
                      rules="required|integer"
                      :name="$t('plan.label.childDPrice')"
                      :show-error="false"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childD.rateCategory"
                      @click="inputData.childD.rateCategory = $event"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childE') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childE.receive"
                      @click="inputData.childE.receive = !!$event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childE.calcCategory"
                      @change="inputData.childE.calcCategory = $event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childE.rate"
                      label=""
                      class="w-47"
                      type="number"
                      rules="required|integer"
                      :name="$t('plan.label.childEPrice')"
                      :show-error="false"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childE.rateCategory"
                      @click="inputData.childE.rateCategory = $event"
                    />
                  </div>
                </div>
                <div class="table-row-group text-black">
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childF') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childF.receive"
                      @click="inputData.childF.receive = !!$event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childF.calcCategory"
                      @change="inputData.childF.calcCategory = $event"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childF.rate"
                      label=""
                      class="w-47"
                      type="number"
                      rules="required|integer"
                      :name="$t('plan.label.childFPrice')"
                      :show-error="false"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childF.rateCategory"
                      @click="inputData.childF.rateCategory = $event"
                    />
                  </div>
                </div>
              </div>
              <div class="mt-1">
                <p
                  v-if="errors[$t('plan.label.childAPrice')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.childAPrice')][0] }}
                </p>
                <p
                  v-if="errors[$t('plan.label.childBPrice')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.childBPrice')][0] }}
                </p>
                <p
                  v-if="errors[$t('plan.label.childCPrice')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.childCPrice')][0] }}
                </p>
                <p
                  v-if="errors[$t('plan.label.childDPrice')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.childDPrice')][0] }}
                </p>
                <p
                  v-if="errors[$t('plan.label.childEPrice')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.childEPrice')][0] }}
                </p>
                <p
                  v-if="errors[$t('plan.label.childFPrice')]"
                  class="text-alert"
                >
                  {{ errors[$t('plan.label.childFPrice')][0] }}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 align-top text-black-dark"
            >
              {{ $t('plan.formTitle.planImages') }}
            </td>
            <td class="p-4">
              <div class="mb-4 text-black-light3">
                <p>{{ $t('plan.label.imageDesc1') }}</p>
                <p>{{ $t('plan.label.imageDesc2') }}</p>
                <p>{{ $t('plan.label.imageDesc3') }}</p>
              </div>
              <ImageBox
                class="w-full"
                :images-list="selectedImages"
                :remove-image="removeImage"
                :is-show-count="false"
                :image-limit="1"
                :duplicate-images="[]"
                @toggle-image-modal="toggleImageSelecModal"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-center mb-8 w-full">
        <Btn
          v-if="isEdit || isCopy"
          color="gray"
          class="w-51 mr-3"
          height="big"
          @click="back"
        >
          {{ $t('plan.backBtnText') }}
        </Btn>
        <Btn
          color="blue"
          class="w-51"
          height="big"
          :is-disabled="
            invalid ||
            isCustomError ||
            checkTimeAcceptDeadlineTime ||
            validateCheckOutTime ||
            validateCheckInTime
          "
          @click="submit(invalid, isCustomError)"
        >
          {{ $t('plan.saveBtnText') }}
        </Btn>
        <Btn
          color="blue"
          class="ml-4 w-51"
          height="big"
          :is-disabled="
            invalid ||
            isCustomError ||
            checkTimeAcceptDeadlineTime ||
            validateCheckOutTime ||
            validateCheckInTime
          "
          @click="
            togglePreviewModal(
              invalid ||
                isCustomError ||
                checkTimeAcceptDeadlineTime ||
                validateCheckOutTime ||
                validateCheckInTime
            )
          "
        >
          {{ $t('global.preview') }}
        </Btn>
      </div>
    </ValidationObserver>
    <ImageSelectModal
      :is-open="isOpenImageSelectModal"
      :images-list="images"
      :current-image-selected="currentImagePos"
      :current-image-id="currentImageId"
      :is-plan="true"
      @select-image="selectImage"
      @toggle-image-modal="toggleImageSelecModal"
    />
    <PlanPreviewModal
      v-show="isOpenPreviewModal"
      :is-plan-preview-modal-open="isOpenPreviewModal"
      :room-info="roomPreviewInfo"
      :close-preview-modal="togglePreviewModal"
      :plan-info="inputData"
      :amenity-list="roomAmenityList"
    />
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { addYears, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'
import alert from '~/mixins/alert'
import { Global, Room, Plan, ImageManage, CancelPolicy } from '~/types'
import {
  DATE_PICKER_FORMAT,
  WHOLESALER_ID_NEPPAN,
  WHOLESALER_ID_DIRECT,
  DEFAULT_TIME_MINUTE,
} from '~/utils/const'
import { accountStore } from '~/store'

@Component({
  components: {
    InputTextarea: () => import('~/components/atoms/InputTextarea.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
    RadioGroup: () => import('~/components/molecules/RadioGroup.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    BtnGroup: () => import('~/components/molecules/BtnGroup.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    ImageSelectModal: () =>
      import('~/components/organisms/ImageSelectModal.vue'),
    ImageBox: () => import('~/components/organisms/ImageBox.vue'),
    TimeSelect: () => import('~/components/molecules/TimeSelect.vue'),
    Loading: () => import('~/components/atoms/Loading.vue'),
    PlanPreviewModal: () =>
      import('~/components/organisms/preview/PlanPreviewModal.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop()
  savePlan!: Function

  @Prop({ default: false })
  isEdit!: boolean

  @Prop({ default: false })
  isCopy!: boolean

  @Prop({ default: null })
  planDetail!: Plan.Input | null

  @Prop({ default: [] })
  rooms!: Room.RoomForPlanEdit[]

  @Prop({ default: [] })
  images!: ImageManage.Main[]

  @Prop()
  setTab!: Function

  @Prop({ default: false })
  isHideStockPrice!: boolean

  @Prop({ default: false })
  isDirect!: boolean

  @Prop({ required: true })
  cancelPolicies!: CancelPolicy.Item[]

  @Prop({ required: true })
  fetchCancelPolicyInfo!: Function

  @Prop()
  fetchRoomInfoPreview!: Function

  @Prop()
  fetchRoomAmenityList!: Function

  private isNotFirstCheck = false
  private isOpenPreviewModal: boolean = false
  private selectedImages: Plan.Image[] = []
  private currentPageNum: number = 1
  private currentImagePos: number = 0
  private currentImageId: number = 0
  private isOpenImageSelectModal: boolean = false
  private dateFormat: string = DATE_PICKER_FORMAT
  private now = new Date()
  private validateError: { [key: string]: boolean } = {}
  private isNotClicked: boolean = false
  private cancelPolicyInfo: CancelPolicy.SettingsWithName | null = null
  private isLoadingCancelPolicy: boolean = false
  private regexRulePlan: string = !this.isDirect
    ? '|regex:^[^_ 　]+$'
    : '|regex:^[^ 　]+$'

  private roomPreviewInfo: Room.Detail[] = []
  private roomAmenityList: { [id: string]: Room.Amenity } = {}
  private inputData: Plan.Input = {
    planId: 0,
    planGroupId: 0,
    roomTypeId: 0,
    name: '',
    planCode: '',
    selectedRooms: [],
    description: '',
    chargeCategory: 1,
    taxCategory: false,
    checkInStart: 'ー:ー',
    checkInEnd: 'ー:ー',
    checkOut: 'ー:ー',
    minStayNum: 0,
    maxStayNum: 0,
    isAccommodatedYearRound: true,
    accommodationPeriodStart: '',
    accommodationPeriodEnd: '',
    publishingStartDate: '',
    publishingEndDate: '',
    isPublishedYearRound: true,
    reserveAcceptDate: 365,
    reserveAcceptTime: '00:00',
    reserveDeadlineDate: 0,
    reserveDeadlineTime: '23:45',
    mealConditionBreakfast: false,
    mealConditionLunch: false,
    mealConditionDinner: false,
    isPackage: false,
    isNoCancel: false,
    isStopSales: false,
    childA: {
      receive: true,
      rateCategory: 0,
      rate: 100,
      calcCategory: true,
    },
    childB: {
      receive: true,
      rateCategory: 0,
      rate: 100,
      calcCategory: true,
    },
    // skyticketホテルのフロントが用意できるまで、コメントアウト
    childC: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childD: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childE: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childF: {
      receive: true,
      rateCategory: 0,
      rate: 100,
      calcCategory: false,
    },
    images: [],
    roomName: '',
    planCancelPolicyId: 0,
    planCancelPolicy:'',
  }

  private activePlanCancelPolicyId: number = 0

  private radioItems: Global.RadioItem[] = [
    { value: true, text: this.$t('plan.label.soldYearRound') as string },
    { value: false, text: this.$t('plan.label.periodSetting') as string },
  ]

  private isMealOption: Global.RadioItem[] = [
    { value: false, text: this.$t('plan.list.noMeal') as string },
    { value: true, text: this.$t('plan.list.meal') as string },
  ]

  private acceptSetting: Global.BtnGroup[] = [
    { name: this.$t('plan.list.button.none') as string, value: false },
    { name: this.$t('plan.list.button.yes') as string, value: true },
  ]

  private rateUnitSetting: Global.BtnGroup[] = [
    { name: this.$t('plan.list.button.yen') as string, value: 1 },
    { name: this.$t('plan.list.button.yenDiscount') as string, value: 2 },
    { name: '%', value: 0 },
  ]

  get taxRadioItems(): Global.RadioItem[] {
    return this.isHideStockPrice
      ? [
          { value: false, text: this.$t('plan.list.button.tax') as string },
          { value: true, text: this.$t('plan.list.button.noTax') as string },
        ]
      : [{ value: false, text: this.$t('plan.list.button.tax') as string }]
  }

  get hourList(): Global.SelectboxItem[] {
    return [...Array(25)].map((_, i) => ({
      name: ('0' + i).slice(-2),
      value: ('0' + i).slice(-2),
    }))
  }

  get CheckInOutHourList(): Global.SelectboxItem[] {
    return [...Array(30)].map((_, i) => ({
      name: ('0' + i).slice(-2),
      value: ('0' + i).slice(-2),
    }))
  }

  get checkInOutMinuteList(): Global.SelectboxItem[] {
    return [
      ...DEFAULT_TIME_MINUTE.map((i) => ({
        name: ('0' + i).slice(-2),
        value: ('0' + i).slice(-2),
      })),
    ]
  }

  get minuteList(): Global.SelectboxItem[] {
    return [
      ...DEFAULT_TIME_MINUTE.map((i) => ({
        name: ('0' + i).slice(-2),
        value: ('0' + i).slice(-2),
      })),
    ]
  }

  get checkMealOption(): string | number | boolean {
    if (
      this.inputData.mealConditionBreakfast ||
      this.inputData.mealConditionLunch ||
      this.inputData.mealConditionDinner
    ) {
      return this.isMealOption[1].value
    }
    return this.isMealOption[0].value
  }

  set checkMealOption(v: string | number | boolean) {
    if (v === this.isMealOption[0].value) {
      this.inputData.mealConditionBreakfast = false
      this.inputData.mealConditionLunch = false
      this.inputData.mealConditionDinner = false
    } else {
      this.inputData.mealConditionBreakfast = true
    }
  }

  get isNotCheckingRoom(): boolean {
    const res =
      this.isNotFirstCheck && this.inputData.selectedRooms.length === 0
    if (res) {
      this.$set(this.validateError, 'selectedRooms', true)
      return res
    }
    this.$set(this.validateError, 'selectedRooms', false)
    return res
  }

  get validateCheckInTime(): boolean {
    if (
      (this.inputData.checkInStart?.includes('ー') &&
        this.inputData.checkInStart?.split(':').filter((time) => time === 'ー')
          .length !== 2) ||
      (this.inputData.checkInEnd?.includes('ー') &&
        this.inputData.checkInEnd?.split(':').filter((time) => time === 'ー')
          .length !== 2)
    ) {
      return true
    }
    if (
      (this.inputData.checkInStart?.includes('ー') &&
        this.inputData.checkInStart?.split(':').filter((time) => time === 'ー')
          .length === 2 &&
        !this.inputData.checkInEnd?.includes('ー')) ||
      (!this.inputData.checkInStart?.includes('ー') &&
        this.inputData.checkInEnd?.includes('ー') &&
        this.inputData.checkInEnd?.split(':').filter((time) => time === 'ー')
          .length === 2)
    ) {
      return true
    }
    if (this.inputData.checkInStart && this.inputData.checkInEnd) {
      const checkInStartHour = Number(this.inputData.checkInStart.split(':')[0])
      const checkInStartMinute = Number(
        this.inputData.checkInStart.split(':')[1]
      )
      const checkInEndtHour = Number(this.inputData.checkInEnd.split(':')[0])
      const checkInEndMinute = Number(this.inputData.checkInEnd.split(':')[1])
      if (
        checkInStartHour > checkInEndtHour ||
        (checkInStartHour === checkInEndtHour &&
          checkInStartMinute > checkInEndMinute)
      ) {
        return true
      }
      return false
    }
    return false
  }

  get validateCheckOutTime(): boolean {
    if (
      this.inputData.checkOut?.includes('ー') &&
      this.inputData.checkOut?.split(':').filter((time) => time === 'ー')
        .length !== 2
    ) {
      return true
    }
    return false
  }

  get isNeppanOrDirect(): boolean {
    const wid = accountStore.currentWholesalerId
    return wid === WHOLESALER_ID_NEPPAN || wid === WHOLESALER_ID_DIRECT
  }

  get cancelPolicySelectBoxItem(): Global.SelectboxItem[] {
    return this.cancelPolicies
      ? this.cancelPolicies.map(
          (item: CancelPolicy.Item): Global.SelectboxItem => {
            return { name: item.name, value: item.id }
          }
        )
      : []
  }

  get currentCancelPolicyItem(): Global.SelectboxItem {
    return this.cancelPolicySelectBoxItem[
      this.activePlanCancelPolicyId === -1 ? 0 : this.activePlanCancelPolicyId
    ]
  }

  get selectedCancelPolicyInfo(): CancelPolicy.Item {
    return this.cancelPolicies[
      this.activePlanCancelPolicyId === -1 ? 0 : this.activePlanCancelPolicyId
    ]
  }

  private async created(): Promise<void> {
    if (!this.planDetail) {
      this.isLoadingCancelPolicy = true
      this.activePlanCancelPolicyId = this.cancelPolicies.findIndex(
        (cancelPolicy) => cancelPolicy.isDefault
      )
      this.cancelPolicyInfo = await this.fetchCancelPolicyInfo(null)
      this.isLoadingCancelPolicy = false
      return
    }
    this.inputData = {
      ...this.planDetail,
      selectedRooms: [],
    }
    this.checkAccommodationPeriodRadioBtn(
      this.planDetail.isAccommodatedYearRound
    )
    this.checkPublishedPeriodRadioBtn(this.planDetail.isPublishedYearRound)

    this.activePlanCancelPolicyId = this.cancelPolicies.findIndex(
      (cancelPolicy) => cancelPolicy.id === this.planDetail?.planCancelPolicyId
    )

    this.selectedImages = this.inputData.images
    if (this.isCopy || this.isEdit) {
      this.isNotFirstCheck = true
      this.inputData.selectedRooms = this.planDetail.selectedRooms
    }
    this.cancelPolicyInfo = await this.fetchCancelPolicyInfo(
      this.cancelPolicies[
        this.activePlanCancelPolicyId === -1 ? 0 : this.activePlanCancelPolicyId
      ].id
    )
    this.isLoadingCancelPolicy = false
  }

  private isAfterNextYear(date: Date): boolean {
    return isAfter(date, addYears(endOfDay(this.now), 1))
  }

  private isBeforeToday(date: Date): boolean {
    return isBefore(date, startOfDay(this.now))
  }

  private selecteTimeCheckInStart(time: string): void {
    this.inputData.checkInStart = time
  }

  private selecteTimeCheckInEnd(time: string): void {
    this.inputData.checkInEnd = time
  }

  private selecteTimeCheckOut(time: string): void {
    this.inputData.checkOut = time
  }

  get checkTimeAcceptDeadlineTime(): boolean {
    try {
      const acceptHour = Number(this.inputData.reserveAcceptTime.split(':')[0])
      const acceptMin = Number(this.inputData.reserveAcceptTime.split(':')[1])
      const deadlineHour = Number(
        this.inputData.reserveDeadlineTime.split(':')[0]
      )
      const deadlineMin = Number(
        this.inputData.reserveDeadlineTime.split(':')[1]
      )
      if (
        Number(this.inputData.reserveAcceptDate) ===
        Number(this.inputData.reserveDeadlineDate)
      ) {
        if (acceptHour > deadlineHour) {
          return true
        }
        if (acceptHour === deadlineHour && acceptMin > deadlineMin) {
          return true
        }
        return false
      }
      return false
    } catch (error) {
      return false
    }
  }

  private disabledDate(date: Date): boolean {
    if (this.isCopy || this.isEdit) {
      return this.isAfterNextYear(date)
    }
    return this.isBeforeToday(date) || this.isAfterNextYear(date)
  }

  private validateDatePicker(
    checkedRadio: boolean,
    date: string,
    key: string
  ): boolean {
    if (!checkedRadio && !date) {
      this.$set(this.validateError, key, true)
      return true
    }
    this.$set(this.validateError, key, false)
    return false
  }

  private timeSeriesCheck(start: string, end: string, key: string): boolean {
    if (isAfter(new Date(start), new Date(end))) {
      this.$set(this.validateError, key, true)
      return true
    }
    this.$set(this.validateError, key, false)
    return false
  }

  private checkAccommodationPeriodRadioBtn(checked: boolean): void {
    this.inputData.isAccommodatedYearRound = checked
    if (checked) {
      this.inputData.accommodationPeriodStart = ''
      this.inputData.accommodationPeriodEnd = ''
    }
  }

  private checkPublishedPeriodRadioBtn(checked: boolean): void {
    this.inputData.isPublishedYearRound = checked
    if (checked) {
      this.inputData.publishingStartDate = ''
      this.inputData.publishingEndDate = ''
    }
  }

  private returnSelectboxItem(dateString: string): Global.SelectboxItem {
    return {
      name: dateString,
      value: dateString,
    }
  }

  private selectedAcceptTime(v: number | string, index: number): void {
    if (typeof v === 'number') return
    const splitData = this.inputData.reserveAcceptTime.split(':')
    splitData[index] = v
    if (index === 0 && v === '24') {
      splitData[1] = '00'
    }
    this.inputData.reserveAcceptTime = splitData.join(':')
  }

  private selectedDeadlineTime(v: number | string, index: number): void {
    if (typeof v === 'number') return
    const splitData = this.inputData.reserveDeadlineTime.split(':')
    splitData[index] = v
    if (index === 0 && v === '24') {
      splitData[1] = '00'
    }
    this.inputData.reserveDeadlineTime = splitData.join(':')
  }

  private async selectedCancelPolicy(index: number): Promise<void> {
    this.isLoadingCancelPolicy = true
    this.activePlanCancelPolicyId = index
    this.cancelPolicyInfo = await this.fetchCancelPolicyInfo(
      this.cancelPolicies[index].id
    )
    this.isLoadingCancelPolicy = false
  }

  private toggleImageSelecModal(
    data: object & { open: boolean; indexPos: number; imageId: number }
  ): void {
    const el = document.body
    if (data.open) {
      this.currentImagePos = data.indexPos
      this.currentImageId = data.imageId
      el.classList.add('swal2-shown')
    } else {
      this.currentImagePos = 0
      this.currentImageId = 0
      el.classList.remove('swal2-shown')
    }
    this.isOpenImageSelectModal = data.open
  }

  private selectImage(data: {
    image: ImageManage.Main
    indexPos: number
  }): void {
    const imageSelected: Plan.Image = {
      imageId: data.image.id,
      order: data.image.sortNum,
      href: data.image.href,
      caption: data.image.caption,
    }
    if (data.indexPos !== -1) {
      imageSelected.order = data.indexPos + 1
      this.selectedImages[data.indexPos] = imageSelected
      this.selectedImages = [...this.selectedImages]
    } else {
      imageSelected.order = this.selectedImages.length + 1
      this.selectedImages.push(imageSelected)
    }
    this.toggleImageSelecModal({ open: false, indexPos: 0, imageId: 0 })
  }

  private removeImage(imagePos: number): void {
    this.selectedImages.splice(imagePos, 1)
    this.selectedImages.forEach((image, index) => {
      image.order = index + 1
    })
  }

  private checkRoom(roomTypeId: number): void {
    this.isNotFirstCheck = true
    const existRoom = this.inputData.selectedRooms.some(
      (id: number, index: number) => {
        if (id === roomTypeId) {
          this.inputData.selectedRooms.splice(index, 1)
          return true
        }
        return false
      }
    )
    if (!existRoom) {
      this.inputData.selectedRooms.push(roomTypeId)
    }
  }

  get isCustomError(): boolean {
    return Object.values(this.validateError).some((res) => res)
  }

  private back(): void {
    this.setTab()
    this.$router.push('/room-plan')
  }

  private async togglePreviewModal(isDisabled: boolean = false): Promise<void> {
    if (isDisabled) return
    if (!this.isOpenPreviewModal) {
      this.$nuxt.$loading.start()
      this.roomAmenityList = {}
      const amenityList: Room.Amenity[] = await this.fetchRoomAmenityList()
      for await (const amenity of amenityList) {
        this.roomAmenityList[amenity.amenityId] = amenity
      }
      this.roomPreviewInfo = await this.fetchRoomInfoPreview(
        this.inputData.selectedRooms
      )
      this.inputData.images = this.selectedImages
      this.$nuxt.$loading.finish()
    }
    this.isOpenPreviewModal = !this.isOpenPreviewModal
    if (this.isOpenPreviewModal) {
      document.body.classList.add('swal2-shown')
    } else {
      document.body.classList.remove('swal2-shown')
    }
  }

  private async submit(invalid: boolean, customError: boolean): Promise<void> {
    if (
      invalid ||
      customError ||
      this.checkTimeAcceptDeadlineTime ||
      this.validateCheckOutTime ||
      this.validateCheckInTime ||
      this.isNotCheckingRoom
    )
      return
    this.isNotClicked = true
    this.inputData.chargeCategory = 1 // 現在、1人単価のみのため
    this.inputData.reserveAcceptDate = Number(this.inputData.reserveAcceptDate)
    this.inputData.reserveDeadlineDate = Number(
      this.inputData.reserveDeadlineDate
    )
    this.inputData.minStayNum = Number(this.inputData.minStayNum)
    this.inputData.maxStayNum = Number(this.inputData.maxStayNum)
    this.inputData.childA.rate = Number(this.inputData.childA.rate)
    this.inputData.childB.rate = Number(this.inputData.childB.rate)
    this.inputData.childC.rate = Number(this.inputData.childC.rate)
    this.inputData.childD.rate = Number(this.inputData.childD.rate)
    this.inputData.childE.rate = Number(this.inputData.childE.rate)
    this.inputData.childF.rate = Number(this.inputData.childF.rate)
    this.inputData.images = this.selectedImages
    if (this.activePlanCancelPolicyId !== -1) {
      this.inputData.planCancelPolicyId = this.cancelPolicies[
        this.activePlanCancelPolicyId
      ].id
    }

    this.$nuxt.$loading.start()
    const res = await this.savePlan(this.inputData)
    if (res && res === 'DuplicateError') {
      // 重複エラー
      this.mixinAlert(
        'error',
        this.$t('plan.alert.duplDataTitle') as string,
        this.$t('plan.alert.duplDataContent') as string
      )
      this.isNotClicked = false
      this.$nuxt.$loading.finish()
      return
    }
    const title = this.isEdit
      ? (this.$t('plan.alert.updateTitle') as string)
      : (this.$t('plan.alert.saveTitle') as string)
    const content = this.isEdit
      ? (this.$t('plan.alert.updateContent') as string)
      : (this.$t('plan.alert.saveContent') as string)
    this.$nuxt.$loading.finish()
    await this.mixinAlert('success', title, content)
    this.setTab()
    this.$router.push('/room-plan')
    this.isNotClicked = false
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
