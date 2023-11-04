import { shallowMount } from '@vue/test-utils'
import MenuBtn from '@/components/atoms/MenuBtn.vue'

describe('Atoms MenuBtn Check', () => {
  test('MenuBtn Test', () => {
    const wrapper = shallowMount(MenuBtn)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
