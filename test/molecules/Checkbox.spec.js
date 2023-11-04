import { mount } from '@vue/test-utils'
import Checkbox from '@/components/molecules/Checkbox.vue'

describe('Molecules Checkbox Check', () => {
  test('Checkbox Test', () => {
    const wrapper = mount(Checkbox)
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
