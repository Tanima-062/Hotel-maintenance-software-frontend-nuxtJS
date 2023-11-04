import { shallowMount } from '@vue/test-utils'
import InnerLink from '@/components/atoms/InnerLink.vue'

describe('Atoms InnerLink Check', () => {
  test('InnerLink Test', () => {
    const wrapper = shallowMount(InnerLink, {
      stubs: {
        NuxtLink: true,
      },
    })

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
