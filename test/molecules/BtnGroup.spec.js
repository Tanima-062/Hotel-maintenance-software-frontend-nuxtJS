import { mount } from '@vue/test-utils'
import BtnGroup from '@/components/molecules/BtnGroup.vue'

describe('Molecules BtnGroup Check', () => {
  test('BtnGroup Test', () => {
    const props = {
      items: [
        { name: 'hoge', value: 0 },
        { name: 'hoge1', value: 1 },
        { name: 'hoge2', value: 2 },
      ],
    }
    const wrapper = mount(BtnGroup, { propsData: props })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
