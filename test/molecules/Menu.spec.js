import { mount } from '@vue/test-utils'
import Menu from '@/components/molecules/Menu.vue'
import MenuBtn from '@/components/atoms/MenuBtn.vue'
import InnerLink from '@/components/atoms/InnerLink.vue'

describe('Molecules Menu Check', () => {
  test('Menu Test', () => {
    const props = {
      menuTabs: [
        {
          key: 'booking',
          name: 'booking',
          items: [
            {
              href: '/booking',
              name: 'booking',
              isShowOnMenu: true,
            },
          ],
        },
      ],
    }
    const wrapper = mount(Menu, {
      propsData: props,
      stubs: {
        MenuBtn,
        InnerLink,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
