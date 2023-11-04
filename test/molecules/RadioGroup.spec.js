import { mount } from '@vue/test-utils'
import RadioGroup from '@/components/molecules/RadioGroup.vue'
import Radio from '@/components/atoms/Radio.vue'

describe('Molecules RadioGroup Check', () => {
  test('RadioGroup Test', () => {
    const props = {
      radioItems: [
        {
          name: 'test 1',
          value: 'test 1',
        },
        {
          name: 'test 2',
          value: 'test 2',
        },
      ],
    }
    const wrapper = mount(RadioGroup, {
      propsData: props,
      stubs: {
        Radio,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
