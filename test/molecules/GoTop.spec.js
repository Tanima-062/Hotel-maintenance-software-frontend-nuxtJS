import { mount } from '@vue/test-utils'
import GoTop from '@/components/molecules/GoTop.vue'
import Icon from '@/components/atoms/Icon.vue'

describe('Molecules GoTop Check', () => {
  test('GoTop Test', () => {
    const props = {
      toTopId: 'testTopId',
    }
    const wrapper = mount(GoTop, {
      propsData: props,
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
