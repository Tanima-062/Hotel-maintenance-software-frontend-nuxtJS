import { shallowMount } from '@vue/test-utils'
import Radio from '@/components/atoms/Radio.vue'

describe('Atoms Radio Check', () => {
  test('Radio Test', () => {
    const wrapper = shallowMount(Radio)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
