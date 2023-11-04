import { mount } from '@vue/test-utils'
import LoadingOverlay from '@/components/molecules/LoadingOverlay.vue'
import Loading from '@/components/atoms/Loading.vue'

describe('Molecules LoadingOverlay Check', () => {
  test('LoadingOverlay Test', () => {
    const wrapper = mount(LoadingOverlay, {
      stubs: {
        Loading,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
