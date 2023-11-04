import { shallowMount } from '@vue/test-utils'
import IconBtn from '@/components/atoms/IconBtn.vue'

describe('Atoms IconBtn Check', () => {
  test('IconBtn Test', () => {
    const wrapper = shallowMount(IconBtn)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
