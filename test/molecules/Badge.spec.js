import { mount } from '@vue/test-utils'
import Badge from '@/components/molecules/Badge.vue'
import IconBtn from '@/components/atoms/IconBtn.vue'

describe('Molecules Badge Check', () => {
  test('Badge Test', () => {
    const slotText = 'test'
    const wrapper = mount(Badge, {
      slots: { default: `<p>${slotText}</p>` },
      stubs: { IconBtn },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // slot test
    expect(wrapper.find('p').text()).toBe(slotText)

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
