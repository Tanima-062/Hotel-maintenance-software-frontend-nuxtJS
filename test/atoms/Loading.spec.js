import { shallowMount } from '@vue/test-utils'
import Loading from '@/components/atoms/Loading.vue'

describe('Atoms Loading Check', () => {
  test('Loading Test', () => {
    const wrapper = shallowMount(Loading)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
