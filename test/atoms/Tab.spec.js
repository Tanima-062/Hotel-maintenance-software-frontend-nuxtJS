import { shallowMount } from '@vue/test-utils'
import Tab from '@/components/atoms/Tab.vue'

describe('Atoms Tab Check', () => {
  test('Tab Test', () => {
    const wrapper = shallowMount(Tab)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
