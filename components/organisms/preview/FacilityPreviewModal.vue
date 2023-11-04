<template>
  <transition name="fade-modal">
    <div class="fixed z-40">
      <div class="fixed inset-0 z-10 bg-white"></div>
      <div
        id="toTopId"
        class="inset-0 fixed overflow-auto h-screen py-18 top-0 left-0 z-40 flex flex-col"
      >
        <div class="relative w-preview m-auto text-font-preview">
          <div
            class="border-0 p-5 rounded-lg shadow-lg relative flex flex-col z-20 w-preview bg-white"
          >
            <!-- <div class="flex items-start justify-between mb-2 rounded-t">
              <h3
                class="text-base font-bold text-black-dark whitespace-no-wrap"
              >
                {{ $t('preview.title') }}
              </h3>
              <IconBtn
                :icon="icon.closeIcon"
                hover-color="text-black-dark"
                color="text-black-dark"
                class="text-black-dark h-6 w-6 text-xl block"
                @click="closeModal"
              />
            </div> -->
            <div>
              <img :src="mainImage" class="object-cover w-full h-68 mb-5" />
              <p class="font-bold text-3xl mb-0.5">
                {{ facilityBaseInfo.name }}
              </p>
              <p>
                {{ facilityBaseInfo.stateProvinceName }}
                {{ facilityBaseInfo.city }} {{ facilityBaseInfo.line1 }}
              </p>
              <div class="divider w-full my-4.5" />
              <div class="px-6 whitespace-pre-line">
                <p class="mb-4.5 font-bold text-xl">施設情報</p>
                <div>{{ facilityDetailInfo.descriptionRooms }}</div>
                <div v-if="isHasOption">
                  <div class="divider w-full my-4.5" />
                  <p class="mb-6 font-bold text-xl">主な設備</p>
                  <div class="flex flex-row mb-6">
                    <div
                      v-if="isFreeWifiOption"
                      class="flex flex-row mr-8 items-center"
                    >
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 20 14"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 7.857a6.13 6.13 0 0 1 4.284 1.728l-1.428 1.388a4.086 4.086 0 0 0-2.855-1.152c-1.114 0-2.125.44-2.856 1.152L5.717 9.585a6.13 6.13 0 0 1 4.284-1.728zM2.859 6.805C4.765 4.95 7.302 3.93 10 3.93c2.698 0 5.235 1.021 7.142 2.876l-1.428 1.389A8.146 8.146 0 0 0 10 5.893a8.146 8.146 0 0 0-5.715 2.301L2.858 6.805zm12.647-5.724A14.115 14.115 0 0 1 20 4.027l-1.428 1.389C16.282 3.19 13.238 1.964 10 1.964c-3.238 0-6.282 1.226-8.572 3.452L0 4.027a14.13 14.13 0 0 1 4.495-2.946A14.396 14.396 0 0 1 9.999 0c1.91 0 3.761.364 5.505 1.08h.001zM8.99 12.768c0-.543.452-.982 1.01-.982.559 0 1.01.44 1.01.982s-.451.982-1.01.982c-.558 0-1.01-.44-1.01-.982z"
                          fill="#4D4D4D"
                          fill-rule="nonzero"
                        ></path>
                      </svg>
                      <p class="ml-3">{{ $t('preview.wifi') }}</p>
                    </div>
                    <div
                      v-if="isRestaurantOption"
                      class="flex flex-row mr-8 items-center"
                    >
                      <svg
                        width="16px"
                        height="20px"
                        viewBox="0 0 16 20"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g fill="#4B4B4B" fill-rule="nonzero">
                            <path
                              id="Path"
                              d="M6.27000411,0.935042454 L6.27000411,5.21250431 C6.27000411,5.48665288 6.03461973,5.70757747 5.74459254,5.70757747 L5.60413598,5.70757747 C5.31410879,5.70757747 5.07805854,5.48665288 5.07805854,5.21250431 L5.07805854,0.915460413 C5.07805854,0.21050694 4.57412121,0 4.09095065,0 C3.60778009,0 3.10384276,0.21050694 3.10384276,0.915460413 L3.10384276,5.21250431 C3.10384276,5.48665288 2.86779251,5.70757747 2.57776532,5.70757747 L2.43730876,5.70757747 C2.14728157,5.70757747 1.91189719,5.48665288 1.91189719,5.21250431 L1.91189719,0.935042454 C1.91189719,-0.326785099 0.000106548231,-0.283939593 0.000106548231,0.949102359 C0.000106548231,2.42570574 0.000106548231,5.0337986 0.000106548231,5.0337986 C-0.00900752183,7.30163393 0.567134879,7.89093586 1.51782811,8.59773005 C2.28449203,9.16682332 2.9392901,9.4929818 2.9392901,10.9065702 L2.9392901,20 L5.24252797,20 L5.24252797,10.9065702 C5.24252797,9.4929818 5.89732604,9.16682332 6.66398996,8.59773005 C7.61530744,7.89093586 8.19082559,7.30163393 8.18171152,5.0337986 C8.18171152,5.0337986 8.18171152,2.42570574 8.18171152,0.949102359 C8.18181818,-0.283939593 6.27000411,-0.326785099 6.27000411,0.935042454 Z"
                            ></path>
                            <path
                              id="Path"
                              d="M12.7493453,1.34561386 C12.2973759,2.63365304 10.9961657,5.65129905 10.9138111,8.3165743 C10.786375,12.4537157 13.2812459,11.8417671 13.325712,14.552188 L13.325712,19.973108 L15.4443136,19.973108 L15.4545455,20 C15.4545455,20 15.4545455,19.9890165 15.4545455,19.973108 C15.4545455,19.6109264 15.4545455,15.2973065 15.4545455,10.8969522 C15.4545455,6.54424521 15.4545455,2.11027597 15.4545455,1.34565295 C15.4545455,-0.225220919 13.4531097,-0.658814783 12.7493453,1.34561386 Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p class="ml-3">{{ $t('preview.restaurant') }}</p>
                    </div>
                    <div
                      v-if="isFrontDeskOption"
                      class="flex flex-row mr-8 items-center"
                    >
                      <svg
                        width="20px"
                        height="16px"
                        viewBox="0 0 20 16"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g fill="#4B4B4B" fill-rule="nonzero">
                            <path
                              id="Path"
                              d="M18.6153906,12.3744141 L1.38460937,12.3744141 C0.619882812,12.3744141 0,12.9942578 0,13.7590234 C0,14.52375 0.619882812,15.1436328 1.38460937,15.1436328 L18.6153906,15.1436328 C19.3800781,15.1436328 20,14.52375 20,13.7590234 C20,12.9942578 19.3800781,12.3744141 18.6153906,12.3744141 Z"
                            ></path>
                            <path
                              id="Path"
                              d="M8.70191406,2.08953125 L11.2980859,2.08953125 C11.8717187,2.08953125 12.3365234,1.6246875 12.3365234,1.05105469 C12.3365234,0.477460938 11.8716797,0.0126171875 11.2980859,0.0126171875 L8.70191406,0.0126171875 C8.12832031,0.0126171875 7.66347656,0.477460938 7.66347656,1.05105469 C7.66347656,1.62472656 8.12828125,2.08953125 8.70191406,2.08953125 Z"
                            ></path>
                            <path
                              id="Shape"
                              d="M10,3.05078125 C5.32695313,3.05078125 1.53847656,6.83921875 1.53847656,11.5123047 L18.4615234,11.5123047 C18.4615234,6.83921875 14.6730859,3.05078125 10,3.05078125 Z M6.44167969,10.1276953 L3.69230469,10.1276953 C3.69230469,7.3671875 5.77042969,5.09558594 8.44679688,4.78304688 L6.44167969,10.1276953 Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p class="ml-3">{{ $t('preview.frontDesk') }}</p>
                    </div>
                    <div
                      v-if="isParkingOption"
                      class="flex flex-row mr-8 items-center"
                    >
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 20 20"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g fill="#4D4D4D" fill-rule="nonzero">
                            <path
                              id="Path"
                              d="M10.842285,6.25 L8.75,6.25 L8.75,10 L10.842285,10 C11.3573491,10 11.7621482,9.8302294 12.057423,9.4904353 C12.3524508,9.1508098 12.5,8.69886089 12.5,8.13463073 C12.5,7.57056916 12.3524155,7.11533274 12.057423,6.76913221 C11.7621482,6.42305812 11.3573491,6.25 10.842285,6.25 Z"
                            ></path>
                            <path
                              id="Shape"
                              d="M17.1199219,0 L2.87992187,0 C1.289375,0 0,1.28941406 0,2.88 L0,17.12 C0,18.7105469 1.289375,20 2.87992187,20 L17.1199219,20 C18.7105078,20 20,18.7105469 20,17.12 L20,2.88 C20,1.28941406 18.7104688,0 17.1199219,0 Z M15.1143571,9.13887394 C14.9224091,9.61820272 14.6464961,10.0385689 14.2866183,10.3996223 C13.9267404,10.7608313 13.4827399,11.0449803 12.9550899,11.2520304 C12.427006,11.4592362 11.8330991,11.5627613 11.1735662,11.5627613 L8.70817596,11.5627613 L8.70817596,16.3218391 L6.20689655,16.3218391 L6.20689655,3.67816093 L11.1735662,3.67816093 C11.8330596,3.67816093 12.4269666,3.78199732 12.9550899,3.98904744 C13.4827399,4.19625321 13.9267404,4.48040224 14.2866183,4.84129991 C14.6464961,5.20266462 14.9224091,5.62271946 15.1143571,6.10220393 C15.3061867,6.5815327 15.4022989,7.08763789 15.4022989,7.62051948 C15.4022989,8.1532843 15.3061867,8.65938949 15.1143571,9.13887394 Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p class="ml-3">{{ $t('preview.parking') }}</p>
                    </div>
                    <div
                      v-if="isBreakfastOption"
                      class="flex flex-row mr-8 items-center"
                    >
                      <svg
                        width="20px"
                        height="14px"
                        viewBox="0 0 20 14"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g fill="#4B4B4B" fill-rule="nonzero">
                            <path
                              id="Shape"
                              d="M19.9605859,5.0850241 C19.8453124,4.35119915 19.4791014,3.71516836 18.9639058,3.2916137 C18.4501556,2.86572968 17.8062491,2.64948775 17.1585535,2.65003127 C16.8596472,2.65003127 16.5588267,2.69692898 16.2668344,2.78862798 C15.7258576,0.929723831 12.9046456,0 8.18167492,0 C2.75913366,0 -0.157859702,1.22493095 0.00659348927,3.67498696 C0.119523222,5.35662707 0.883195406,9.29417133 3.32194639,11.8085952 C4.93620485,13.4727652 6.06936937,13.6363636 8.18167492,13.6363636 C10.2939805,13.6363636 11.4270278,13.4727652 13.0414034,11.8085952 C13.837185,10.9880406 14.4518337,10.0160777 14.9264433,9.020239 C15.3509747,9.18356572 15.7876936,9.26357911 16.2112094,9.2630356 C16.7313659,9.2630356 17.2285536,9.14835361 17.6763662,8.95245473 C18.348554,8.65817935 18.9144136,8.18776581 19.3267966,7.60965834 C19.7372655,7.0315897 19.9989844,6.33262745 20,5.58195349 C20,5.41773386 19.9872656,5.25184485 19.9605859,5.0850241 Z M8.18167492,4.65424844 C4.9599158,4.65424844 2.34839131,3.99608875 2.34839131,3.18450212 C2.34839131,2.37268255 4.9599158,1.71452286 8.18167492,1.71452286 C11.4033168,1.71452286 14.0149585,2.37268255 14.0149585,3.18450212 C14.0149585,3.99608875 11.4032778,4.65424844 8.18167492,4.65424844 Z M17.8896085,6.180404 C17.7510538,6.4852003 17.5019521,6.77974744 17.1992567,6.98410965 C16.8958191,7.1899083 16.5511314,7.30373618 16.2112094,7.30315607 C16.0274203,7.30198917 15.8405452,7.26766998 15.6462092,7.19313057 C15.868514,6.49890468 16.0319515,5.83286401 16.1448422,5.24019807 C16.2832407,5.0242279 16.4378892,4.876042 16.593983,4.77824785 C16.7835143,4.66007183 16.9781238,4.60999066 17.1585535,4.60999066 C17.3710146,4.61030124 17.5575771,4.67812434 17.7010928,4.79719328 C17.8431632,4.918281 17.9608586,5.08770286 18.0135929,5.39451794 C18.0233976,5.45651764 18.028243,5.51851735 18.028243,5.58195349 C18.0285539,5.77346542 17.9827336,5.97778881 17.8896085,6.180404 Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p class="ml-3">{{ $t('preview.breakfast') }}</p>
                    </div>
                    <div
                      v-if="isLaundryOption"
                      class="flex flex-row mr-8 items-center"
                    >
                      <svg
                        width="18px"
                        height="20px"
                        viewBox="0 0 18 20"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                      >
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g fill="#4B4B4B" fill-rule="nonzero">
                            <path
                              id="Shape"
                              d="M8.71265625,3.80546875 C6.23699219,3.80546875 4.2234375,5.81894531 4.2234375,8.29460938 C4.2234375,10.7703516 6.23699219,12.7838281 8.71265625,12.7838281 C11.1883203,12.7838281 13.201875,10.7703516 13.201875,8.29460938 C13.201875,5.81894531 11.1883203,3.80546875 8.71265625,3.80546875 Z M8.81808594,11.9270313 C6.78835938,11.9270313 5.13964844,10.2973047 5.10996094,8.27570313 C5.45320313,8.27570313 5.5990625,8.40273438 5.89640625,8.68648438 C6.23699219,9.01355469 6.70183594,9.46222656 7.58289063,9.46222656 C8.46132813,9.46222656 8.92613281,9.01355469 9.26671875,8.68648438 C9.56402344,8.40273438 9.71265625,8.27570313 10.0532422,8.27570313 C10.3964844,8.27570313 10.5424219,8.40273438 10.8396875,8.68648438 C11.1532422,8.9865625 11.5721875,9.38921875 12.3153516,9.4540625 C11.8073047,10.8946094 10.4342188,11.9270313 8.81808594,11.9270313 Z"
                            ></path>
                            <path
                              id="Shape"
                              d="M0.015390625,0 L0.015390625,15.2594531 L17.1721484,15.2594531 L17.1721484,0 L0.015390625,0 Z M15.0450391,2.17300781 C15.3586328,2.17300781 15.6126563,2.42699219 15.6126563,2.74058594 C15.6126563,3.0540625 15.3585938,3.308125 15.0450391,3.308125 C14.7315625,3.308125 14.4775,3.0540625 14.4775,2.74058594 C14.4775,2.42699219 14.7315625,2.17300781 15.0450391,2.17300781 Z M3.59644531,0.613476563 L13.5910547,0.613476563 L13.5910547,1.41347656 L13.5883984,1.41347656 C13.5802344,1.65136719 13.3829297,1.84324219 13.1423828,1.84324219 L4.04507813,1.84324219 C3.80453125,1.84324219 3.60722656,1.65136719 3.59644531,1.41347656 L3.59644531,0.613476563 L3.59644531,0.613476563 Z M2.14238281,3.308125 C1.82886719,3.308125 1.57484375,3.0540625 1.57484375,2.74058594 C1.57484375,2.42699219 1.82890625,2.17300781 2.14238281,2.17300781 C2.4559375,2.17300781 2.71,2.42699219 2.71,2.74058594 C2.71,3.0540625 2.4559375,3.308125 2.14238281,3.308125 Z M15.9883594,9.508125 C15.9883594,9.95671875 14.6423828,10.1486719 14.1937891,10.1513672 C14.1532031,10.1513672 14.1126953,10.1487109 14.0748438,10.1405078 C13.3072656,12.3648828 11.19375,13.9648828 8.71265625,13.9648828 C5.58558594,13.9648828 3.04234375,11.4215234 3.04234375,8.29457031 C3.04234375,5.16761719 5.58558594,2.62160156 8.71265625,2.62160156 C11.19375,2.62160156 13.3045703,4.22164063 14.0748438,6.44324219 C14.1072656,6.44058594 14.1423438,6.4378125 14.1748438,6.4378125 C14.6234375,6.43515625 15.9883594,6.65136719 15.9883594,7.09730469 L15.9883594,9.508125 Z"
                            ></path>
                            <path
                              id="Path"
                              d="M2.44511719,18.8649219 L2.58566406,18.8649219 C2.66398438,19.5053906 3.20726563,20 3.86667969,20 C4.52617188,20 5.07214844,19.5053906 5.14773437,18.8649219 L12.0396875,18.8649219 C12.1153516,19.5053906 12.6585938,20 13.3180469,20 C13.9801953,20 14.5234766,19.5053906 14.5991797,18.8649219 L14.7397266,18.8649219 C15.7828906,18.8649219 17.1721484,16.2540625 17.1721484,16.2540625 L0.015390625,16.2540625 C0.015390625,16.2540625 1.401875,18.8649219 2.44511719,18.8649219 Z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p class="ml-3">{{ $t('preview.laundry') }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-content mt-6">
                <div class="flex flew-row w-full">
                  <button
                    class="text-left w-full font-bold text-xl tab-space flex flex-row items-center"
                    :class="
                      selectedTab === 0
                        ? 'border-selected'
                        : 'border-no-selected'
                    "
                    @click="handleChangeTag(0)"
                  >
                    <p class="w-full preview-word-break">
                      {{ $t('preview.baseInfo') }}
                    </p>
                    <Icon
                      v-if="selectedTab !== 0"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowDown"
                      color="text-black"
                    />
                    <Icon
                      v-if="selectedTab === 0"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowUp"
                      color="text-black"
                    />
                  </button>
                  <button
                    class="text-left w-full font-bold text-xl tab-space flex flex-row items-center"
                    :class="
                      selectedTab === 1
                        ? 'border-selected border-left'
                        : 'border-no-selected border-left'
                    "
                    @click="handleChangeTag(1)"
                  >
                    <p class="w-full preview-word-break">
                      {{ $t('preview.amenities') }}
                    </p>
                    <Icon
                      v-if="selectedTab !== 1"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowDown"
                      color="text-black"
                    />
                    <Icon
                      v-if="selectedTab === 1"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowUp"
                      color="text-black"
                    />
                  </button>
                  <button
                    class="text-left w-full font-bold text-xl tab-space flex flex-row items-center"
                    :class="
                      selectedTab === 2
                        ? 'border-selected border-left'
                        : 'border-no-selected border-left'
                    "
                    @click="handleChangeTag(2)"
                  >
                    <p class="w-full preview-word-break">
                      {{ $t('preview.hotelPolicy') }}
                    </p>
                    <Icon
                      v-if="selectedTab !== 2"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowDown"
                      color="text-black"
                    />
                    <Icon
                      v-if="selectedTab === 2"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowUp"
                      color="text-black"
                    />
                  </button>
                  <button
                    class="text-left w-full font-bold text-xl tab-space flex flex-row items-center"
                    :class="
                      selectedTab === 3
                        ? 'border-selected border-left'
                        : 'border-no-selected border-left'
                    "
                    @click="handleChangeTag(3)"
                  >
                    <p class="w-full preview-word-break">
                      {{ $t('preview.importantNews') }}
                    </p>
                    <Icon
                      v-if="selectedTab !== 3"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowDown"
                      color="text-black"
                    />
                    <Icon
                      v-if="selectedTab === 3"
                      icon-width="30"
                      icon-height="30"
                      :icon="icon.arrowUp"
                      color="text-black"
                    />
                  </button>
                </div>
                <div class="p-3.5">
                  <div v-if="selectedTab === 0">
                    <!-- eslint-disable -->
                    <div
                      v-if="facilityDetailInfo.descriptionRooms.trim().length"
                      class="mt-2"
                    >
                      <p class="text-base font-bold">
                        {{ $t('facility.detailinput.service') }}
                      </p>
                      <div
                        class="whitespace-pre-line"
                        v-html="facilityDetailInfo.descriptionRooms"
                      />
                    </div>
                    <div
                      v-if="facilityDetailInfo.descriptionAmenity.trim().length"
                      class="mt-2"
                    >
                      <p class="text-base font-bold">
                        {{ $t('facility.detailinput.amenity') }}
                      </p>
                      <div
                        class="whitespace-pre-line"
                        v-html="facilityDetailInfo.descriptionAmenity"
                      />
                    </div>
                    <div
                      v-if="
                        facilityDetailInfo.descriptionAttractions.trim().length
                      "
                      class="mt-2"
                    >
                      <p class="text-base font-bold">
                        {{ $t('facility.detailinput.spot') }}
                      </p>
                      <div
                        class="whitespace-pre-line"
                        v-html="facilityDetailInfo.descriptionAttractions"
                      />
                    </div>
                    <div
                      v-if="
                        facilityDetailInfo.descriptionHeadline.trim().length
                      "
                      class="mt-2"
                    >
                      <p class="text-base font-bold">
                        {{ $t('facility.detailinput.around') }}
                      </p>
                      <div
                        class="whitespace-pre-line"
                        v-html="facilityDetailInfo.descriptionHeadline"
                      />
                    </div>
                    <div
                      v-if="
                        facilityDetailInfo.descriptionLocation.trim().length
                      "
                      class="mt-2"
                    >
                      <p class="text-base font-bold">
                        {{ $t('facility.detailinput.view') }}
                      </p>
                      <div
                        class="whitespace-pre-line"
                        v-html="facilityDetailInfo.descriptionLocation"
                      />
                    </div>
                    <div
                      v-if="facilityDetailInfo.descriptionDining.trim().length"
                      class="mt-2"
                    >
                      <p class="text-base font-bold">
                        {{ $t('facility.detailinput.food') }}
                      </p>
                      <div
                        class="whitespace-pre-line"
                        v-html="facilityDetailInfo.descriptionDining"
                      />
                    </div>
                    <div
                      v-if="
                        !facilityDetailInfo.descriptionRooms.trim().length &&
                        !facilityDetailInfo.descriptionAmenity.trim().length &&
                        !facilityDetailInfo.descriptionAttractions.trim()
                          .length &&
                        !facilityDetailInfo.descriptionHeadline.trim().length &&
                        !facilityDetailInfo.descriptionLocation.trim().length &&
                        !facilityDetailInfo.descriptionDining.trim().length
                      "
                    >
                      {{ $t('preview.noInfo') }}
                    </div>
                    <!-- eslint-enable -->
                  </div>
                  <div v-if="selectedTab === 1">
                    <ul class="ml-4.5 list-inside list-initial">
                      <li v-for="(amenity, index) in amenityList" :key="index">
                        {{ amenity.name }}
                      </li>
                    </ul>
                    <div v-if="!amenityList.length">
                      {{ $t('preview.noInfo') }}
                    </div>
                  </div>
                  <div v-if="selectedTab === 2">
                    <template
                      v-if="
                        facilityDetailInfo.checkinBegin.length &&
                        facilityDetailInfo.checkinEnd.length
                      "
                    >
                      <p class="text-lg font-bold">
                        {{ $t('facility.detailinput.checkin') }}
                      </p>
                      <p class="text-lg">
                        {{ facilityDetailInfo.checkinBegin }} -
                        {{ facilityDetailInfo.checkinEnd }}
                      </p>
                    </template>
                    <!-- eslint-disable -->
                    <div
                      v-if="facilityDetailInfo.specialInstructions"
                      class="whitespace-pre-line py-2 mt-1 mb-2"
                      v-html="facilityDetailInfo.specialInstructions"
                    />
                    <!-- eslint-enable -->
                    <template v-if="facilityDetailInfo.checkout">
                      <p class="text-lg font-bold">
                        {{ $t('facility.detailinput.checkout') }}
                      </p>
                      <p class="text-lg">
                        {{ facilityDetailInfo.checkout }}
                      </p>
                    </template>
                    <div
                      v-if="
                        !facilityDetailInfo.checkinBegin.length &&
                        !facilityDetailInfo.checkinEnd.length &&
                        !facilityDetailInfo.checkout.length
                      "
                    >
                      {{ $t('preview.noInfo') }}
                    </div>
                  </div>
                  <div v-if="selectedTab === 3">
                    <!-- eslint-disable -->
                    <div
                      class="whitespace-pre-line"
                      v-html="facilityDetailInfo.feeMandatory"
                    />
                    <div
                      class="whitespace-pre-line"
                      v-html="facilityDetailInfo.feeOptional"
                    />
                    <div
                      v-if="
                        !facilityDetailInfo.feeMandatory.trim().length &&
                        !facilityDetailInfo.feeMandatory.trim().length
                      "
                    >
                      {{ $t('preview.noImportantInfo') }}
                    </div>
                    <!-- eslint-enable -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Btn
          color="blue"
          class="mt-8 mx-auto py-3 w-60"
          height="big"
          type="button"
          @click="closeModal"
        >
          {{ $t('alert.confirmButton') }}
        </Btn>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiClose, mdiChevronDown, mdiChevronUp } from '@mdi/js'
import { Facility } from '~/types'
import {
  freeWifiKeys,
  restaurantKeys,
  frontDeskKeys,
  parkKeys,
  breakfastKeys,
  laundryKeys,
} from '~/utils/amenity'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class FacilityPreviewModal extends Vue {
  @Prop({ required: true })
  closePreviewModal!: Function

  @Prop({ required: true })
  amenityList!: Facility.Amenity[]

  @Prop({ required: true })
  facilityBaseInfo!: Facility.FacilityBaseInfo

  @Prop({ required: true })
  facilityDetailInfo!: Facility.FacilityDetailInfo

  @Prop({ required: true })
  mainImage!: string

  private selectedTab: number = 0
  private icon: { [key: string]: string } = {
    closeIcon: mdiClose,
    arrowUp: mdiChevronUp,
    arrowDown: mdiChevronDown,
  }

  get isHasOption(): boolean {
    return (
      this.isFreeWifiOption ||
      this.isRestaurantOption ||
      this.isFrontDeskOption ||
      this.isParkingOption ||
      this.isLaundryOption ||
      this.isBreakfastOption
    )
  }

  get isFreeWifiOption(): boolean {
    return this.amenityList.some((amenity) =>
      freeWifiKeys.includes(Number(amenity.amenityId))
    )
  }

  get isRestaurantOption(): boolean {
    return this.amenityList.some((amenity) =>
      restaurantKeys.includes(Number(amenity.amenityId))
    )
  }

  get isFrontDeskOption(): boolean {
    return this.amenityList.some((amenity) =>
      frontDeskKeys.includes(Number(amenity.amenityId))
    )
  }

  get isParkingOption(): boolean {
    return this.amenityList.some((amenity) =>
      parkKeys.includes(Number(amenity.amenityId))
    )
  }

  get isBreakfastOption(): boolean {
    return this.amenityList.some((amenity) =>
      breakfastKeys.includes(Number(amenity.amenityId))
    )
  }

  get isLaundryOption(): boolean {
    return this.amenityList.some((amenity) =>
      laundryKeys.includes(Number(amenity.amenityId))
    )
  }

  private closeModal(): void {
    this.scrollToTopModal()
    this.closePreviewModal()
  }

  private handleChangeTag(tabIndex: number): void {
    this.selectedTab = tabIndex
  }

  private scrollToTopModal(): void {
    const scroll = document.getElementById('toTopId')
    if (!scroll) return
    scroll.scrollTop = 0
  }
}
</script>
<style lang="sass" scoped>
.fade-modal-enter-active, .fade-modal-leave-active
  transition: all 0.4s
.fade-modal-enter, .fade-modal-leave-to
  opacity: 0
.divider
  border-bottom: 1px solid rgb(228, 228, 228)
.w-preview
  width: 1024px
.tab-space
  padding: 16px 20px 20px
.border-selected
  border-top: 5px solid rgb(28, 93, 181)
.border-no-selected
  border-top: 1px solid rgb(228, 228, 228)
  border-bottom: 1px solid rgb(228, 228, 228)
.border-left
  border-left: 1px solid rgb(228, 228, 228)
.border-content
  border-right: 1px solid rgb(228, 228, 228)
  border-left: 1px solid rgb(228, 228, 228)
  border-bottom: 1px solid rgb(228, 228, 228)
.preview-word-break
  word-break: keep-all
.list-initial
  list-style: initial !important
.text-font-preview
  font-family: "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", メイリオ, Meiryo, sans-serif
</style>
