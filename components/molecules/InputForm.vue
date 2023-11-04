<template>
  <validation-provider
    v-slot="{ errors }"
    tag="div"
    :rules="rules"
    :name="name"
  >
    <label class="text-black-dark mb-2">{{ label }}</label>
    <div class="relative">
      <InputText
        :type="type"
        :class="styles"
        :error="!!errors[0]"
        :placeholder="placeholder"
        :value="value"
        :bg="bg"
        :padding="padding"
        :disabled="disabled"
        :maxlength="textLength"
        :prevent-space="preventSpace"
        @input="input"
        @blur="blur"
      />
      <div
        v-if="showTextLength"
        class="absolute right-0 bottom-0 text-inputLength text-sm py-2.5 pr-2"
      >
        {{ inputTextLength }}/ {{ textLength }}
      </div>
    </div>
    <ErrorText v-if="showError" :no-wrap="errorNoWrap" :err-text="errors[0]" />
  </validation-provider>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component({
  components: {
    InputText: () => import('~/components/atoms/InputText.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: 'text' })
  label!: string

  @Prop({ default: 'text' })
  type!: string

  @Prop({ default: '' })
  placeholder!: string

  @Prop({ default: '' })
  value!: string

  @Prop({ default: '' })
  name!: string

  @Prop({ default: '' })
  rules!: string

  @Prop({ default: '' })
  bg!: string

  @Prop({ default: false })
  disabled!: boolean

  @Prop({ default: false })
  showTextLength!: boolean

  @Prop({ default: 1000 })
  textLength!: number

  @Prop({ default: 'w-full' })
  width!: string

  @Prop({ default: false })
  errorNoWrap!: boolean

  @Prop({ default: true })
  showError!: boolean

  @Prop({ default: 0 })
  inputTextLength!: number

  @Prop({ default: 'py-2' })
  padding!: string

  @Prop({ default: false })
  preventSpace!: boolean

  get styles(): string {
    const style = []
    if (this.showTextLength) {
      style.push('pr-16')
    }
    if (this.type === 'number') {
      style.push('text-right')
    }
    if (this.disabled) {
      style.push('cursor-not-allowed ')
    }
    style.push(this.width)
    return style.join(' ')
  }

  @Emit()
  private input(e: string | number): string | number {
    return e
  }

  @Emit()
  private blur(e: string | number): string | number {
    return e
  }
}
</script>
