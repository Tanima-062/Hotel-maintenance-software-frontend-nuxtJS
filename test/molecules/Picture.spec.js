import { mount } from '@vue/test-utils'
import Picture from '@/components/molecules/Picture.vue'
import IconBtn from '@/components/atoms/IconBtn.vue'
import Icon from '@/components/atoms/Icon.vue'

describe('Molecules Picture Check', () => {
  test('Picture Test', () => {
    const wrapper = mount(Picture, {
      stubs: {
        IconBtn,
        Icon,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
