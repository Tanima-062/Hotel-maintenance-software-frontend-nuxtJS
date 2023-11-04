import { mount } from '@vue/test-utils'
import Tabs from '@/components/molecules/Tabs.vue'
import Tab from '@/components/atoms/Tab.vue'

describe('Molecules Tabs Check', () => {
  test('Tabs Test', () => {
    const props = {
      tabData: [
        {
          name: 'test 1',
          value: 1,
          disable: false,
        },
        {
          name: 'test 2',
          value: 2,
          disable: true,
        },
      ],
      activeTab: {
        value: 1,
      },
    }
    const wrapper = mount(Tabs, { propsData: props, stubs: { Tab } })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
