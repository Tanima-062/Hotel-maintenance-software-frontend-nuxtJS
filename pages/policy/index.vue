<template>
  <main class="flex-1 pt-8 px-3 m-auto mb-5">
    <h1 class="text-3xl text-black-dark font-bold">
      {{ $t('policy.pageName') }}
    </h1>
    <div class="flex items-center mt-8 p-3 bg-menuColor">
      <h1 class="text-xl text-black-dark font-bold">
        {{ $t('policy.pageTitle') }}
      </h1>
      <h1 class="text-black-dark">{{ $t('policy.companyName') }}</h1>
    </div>
    <div class="mt-5 border-b-2 border-bdColor leading-10">
      <h2 class="text-black-dark">{{ $t('policy.firstSentence.title') }}</h2>
      <div class="ml-8 text-black">
        <div>
          {{ $t('policy.firstSentence.firstLine') }}
        </div>
        <div>
          {{ $t('policy.firstSentence.secondLine') }}
          <div>
            <div>
              {{ $t('policy.firstSentence.thirdLine') }}
            </div>
            <div>
              {{ $t('policy.firstSentence.fourthLine') }}
            </div>
          </div>
        </div>
      </div>
      <h2 class="mt-5 text-black-dark">
        {{ $t('policy.secondSentence.title') }}
      </h2>
      <div class="mb-5 ml-8 text-black">
        <h2>{{ $t('policy.secondSentence.firstSection.subhead') }}</h2>
        <div class="ml-6">
          <div>{{ $t('policy.secondSentence.firstSection.firstLine') }}</div>
          <div>
            {{ $t('policy.secondSentence.firstSection.secondLine') }}
          </div>
          <div>{{ $t('policy.secondSentence.firstSection.thirdLine') }}</div>
          <div>{{ $t('policy.secondSentence.firstSection.fourthLine') }}</div>
        </div>
        <h2>{{ $t('policy.secondSentence.secondSection.subhead') }}</h2>
        <div class="ml-6">
          <div>{{ $t('policy.secondSentence.secondSection.firstLine') }}</div>
          <div>{{ $t('policy.secondSentence.secondSection.secondLine') }}</div>
        </div>
        <h2>{{ $t('policy.secondSentence.thirdSection.subhead') }}</h2>
        <div class="ml-6">
          <div>
            {{ $t('policy.secondSentence.thirdSection.firstLine') }}
          </div>
          <div>{{ $t('policy.secondSentence.thirdSection.secondLine') }}</div>
        </div>
      </div>
    </div>
    <div class="mt-3 -mr-3 text-right text-black">
      {{ $t('policy.dateRevised') }}
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.policy') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }
}
</script>
