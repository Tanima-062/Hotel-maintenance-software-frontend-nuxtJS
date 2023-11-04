<template>
  <div class="overflow-y-hidden">
    <header class="border-b border-white">
      <div
        class="bg-gradient-to-r to-topColor-left from-topColor-right w-full h-16 px-8 flex items-center justify-center"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center">
            <img src="/images/skyticket_HMW.png" class="h-7 -mb-4px" />
            <p class="ml-3 text-white text-lg font-bold whitespace-no-wrap">
              {{ $t('global.systemName') }}
            </p>
          </div>
        </div>
      </div>
    </header>
    <main class="bg-fixed w-full error-body-minHeight px-8 flex">
      <div>
        <Icon
          :icon="infoIcon"
          class="mt-24"
          :icon-width="72"
          :icon-height="72"
        />
        <h1 class="mt-8 text-3xl font-bold text-white">
          <p>{{ $t('maintenance.maintenanceTitle') }}</p>
          <p>{{ $t('maintenance.maintenanceDatetime') }}</p>
        </h1>
        <div class="mt-6 leading-10">
          <div class="text-lg text-white">
            {{ $t('maintenance.maintenanceDescriptionOne') }}
          </div>
          <div class="text-lg text-white">
            {{ $t('maintenance.maintenanceDescriptionTwo') }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { mdiInformation } from '@mdi/js'
import { IS_MAINTENANCE } from '~/utils/const'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  private infoIcon: string = mdiInformation

  private created(): void {
    if (!IS_MAINTENANCE) {
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="sass" scoped>
.bg-fixed
  background-image: linear-gradient(to left, rgba(14,158,165,0.9), rgba(34,68,119,0.9)), url(/images/errorg1920.jpg)
  background-repeat: no-repeat
  background-size: cover

.error-body-minHeight
  min-height: calc(100vh - 57px)
</style>
