import { shallowMount } from '@vue/test-utils'
import InputText from '@/components/atoms/InputText.vue'

describe('Atoms InputText Check', () => {
  test('InputText Test', () => {
    const wrapper = shallowMount(InputText)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
