<template>
  <div class="flex items-center justify-center flex-col h-50">
    <Icon
      :icon="icons.alert"
      color="text-bdColor"
      class="mb-1"
      :icon-width="40"
      :icon-height="40"
    />

    <p class="text-center text-black-light">
      <slot />
    </p>
  </div>
</template>
<script lang="ts">
import { mdiAlertCircleOutline } from '@mdi/js'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  private icons = {
    alert: mdiAlertCircleOutline,
  }
}
</script>
