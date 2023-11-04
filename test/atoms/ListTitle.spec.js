import { shallowMount } from '@vue/test-utils'
import ListTitle from '@/components/atoms/ListTitle.vue'

describe('Atoms ListTitle Check', () => {
  test('ListTitle Test', () => {
    const wrapper = shallowMount(ListTitle)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
