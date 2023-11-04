import { shallowMount } from '@vue/test-utils'
import Tag from '@/components/atoms/Tag.vue'

describe('Atoms Tag Check', () => {
  test('Tag Test', () => {
    const wrapper = shallowMount(Tag)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
