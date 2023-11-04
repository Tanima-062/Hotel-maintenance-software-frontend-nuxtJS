import { mount } from '@vue/test-utils'
import ToggleBtn from '@/components/molecules/ToggleBtn.vue'
import Icon from '@/components/atoms/Icon.vue'

describe('Molecules ToggleBtn Check', () => {
  test('ToggleBtn True Test', () => {
    const props = {
      toggleMenu: [
        {
          name: 'test 1',
          value: 1,
        },
        {
          name: 'test 2',
          value: 2,
        },
      ],
      isActive: true,
    }
    const wrapper = mount(ToggleBtn, { propsData: props, stubs: { Icon } })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  test('ToggleBtn False Test', () => {
    const props = {
      toggleMenu: [
        {
          name: 'test 1',
          value: 1,
        },
        {
          name: 'test 2',
          value: 2,
        },
      ],
      isActive: false,
    }
    const wrapper = mount(ToggleBtn, { propsData: props, stubs: { Icon } })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
