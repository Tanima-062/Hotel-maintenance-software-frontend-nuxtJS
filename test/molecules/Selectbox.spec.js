import { mount } from '@vue/test-utils'
import Selectbox from '@/components/molecules/Selectbox.vue'
import Icon from '@/components/atoms/Icon.vue'
import ErrorText from '@/components/atoms/ErrorText.vue'

describe('Molecules Selectbox Check', () => {
  test('Selectbox Test', () => {
    const props = {
      items: [
        {
          name: 'test 1',
          value: 'test 1',
        },
        {
          name: 'test 2',
          value: 'test 2',
        },
      ],
      activeItem: {
        name: 'test 1',
        value: 'test 1',
      },
    }
    const wrapper = mount(Selectbox, {
      propsData: props,
      stubs: {
        Icon,
        ErrorText,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
