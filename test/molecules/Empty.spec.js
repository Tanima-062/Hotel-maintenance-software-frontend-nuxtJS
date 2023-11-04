import { mount } from '@vue/test-utils'
import Empty from '@/components/molecules/Empty.vue'
import Icon from '@/components/atoms/Icon.vue'

describe('Molecules Empty Check', () => {
  test('Empty Test', () => {
    const wrapper = mount(Empty, {
      stubs: {
        Icon,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
