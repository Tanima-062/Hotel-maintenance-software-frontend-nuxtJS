import { mount } from '@vue/test-utils'
import Breadcrumb from '@/components/molecules/Breadcrumb.vue'
import Icon from '@/components/atoms/Icon.vue'
import InnerLink from '@/components/atoms/InnerLink.vue'

describe('Molecules Breadcrumb Check', () => {
  test('Breadcrumb Test', () => {
    const props = {
      breadcrumbList: [
        { name: 'bread1', href: '/' },
        { name: 'bread2', href: '/' },
      ],
    }
    const wrapper = mount(Breadcrumb, {
      propsData: props,
      stubs: {
        Icon,
        InnerLink,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
