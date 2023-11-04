import { shallowMount } from '@vue/test-utils'
import InputTextarea from '@/components/atoms/InputTextarea.vue'

describe('Atoms InputTextarea Check', () => {
  test('InputTextarea Test', () => {
    const wrapper = shallowMount(InputTextarea)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
