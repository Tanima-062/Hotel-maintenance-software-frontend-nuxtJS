<template>
  <div class="flex items-end">
    <div
      v-for="(item, key) in breadcrumbList"
      :key="key"
      class="flex items-center"
    >
      <p v-if="key === 0" class="whitespace-no-wrap text-black">
        {{ item.name }}
      </p>

      <InnerLink
        v-else-if="breadcrumbList.length - 1 !== key"
        class="ml-3"
        text-color="text-black"
        :href="item.href"
        :show-underline="false"
        :focus-on="false"
      >
        {{ item.name }}
      </InnerLink>

      <p
        v-else
        class="whitespace-no-wrap ml-3 text-3xl text-black-dark font-bold"
      >
        {{ breadcrumbList[breadcrumbList.length - 1].name }}
      </p>
      <Icon
        v-if="breadcrumbList.length - 1 !== key"
        :icon="chevronRight"
        class="mt-1 ml-3"
        color="text-black"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { mdiChevronRight } from '@mdi/js'

@Component({
  components: {
    InnerLink: () => import('~/components/atoms/InnerLink.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [], required: true })
  breadcrumbList!: string[]

  private chevronRight = mdiChevronRight
}
</script>
