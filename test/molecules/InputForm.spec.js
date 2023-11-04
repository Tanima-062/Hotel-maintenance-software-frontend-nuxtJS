import { mount } from '@vue/test-utils'
import InputForm from '@/components/molecules/InputForm.vue'
import InputText from '@/components/atoms/InputText.vue'
import ErrorText from '@/components/atoms/ErrorText.vue'

describe('Molecules InputForm Check', () => {
  test('InputForm Test', () => {
    const wrapper = mount(InputForm, {
      stubs: {
        InputText,
        ErrorText,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
