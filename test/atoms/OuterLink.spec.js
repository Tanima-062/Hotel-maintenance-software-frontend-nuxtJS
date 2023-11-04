import { shallowMount } from '@vue/test-utils'
import OuterLink from '@/components/atoms/OuterLink.vue'

describe('Atoms OuterLink Check', () => {
  test('OuterLink Test', () => {
    const wrapper = shallowMount(OuterLink)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
