<template>
  <transition name="loading">
    <div v-if="isLoading" class="loading">
      <div class="loading-body">
        <Loading />
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    Loading: () => import('~/components/atoms/Loading.vue'),
  },
})
export default class extends Vue {
  private isLoading: boolean = false

  private start(): void {
    this.isLoading = true
  }

  private finish(): void {
    this.isLoading = false
  }
}
</script>
<style lang="sass" scoped>
.loading
  filter: contrast(1)
  font-size: 30px
  position: fixed
  z-index: 1000
  top: 0
  right: 0
  bottom: 0
  left: 0
  text-align: center
  background: rgba(255, 255, 255, .4)

.loading-body
  position: absolute
  top: 50%
  left: 50%
  width: 40px
  height: 40px
  transform: translate(-50%, -50%)
  border-radius: 8px
</style>
