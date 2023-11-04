import { shallowMount } from '@vue/test-utils'
import Icon from '@/components/atoms/Icon.vue'

describe('Atoms Icon Check', () => {
  test('Icon Test', () => {
    const props = {
      icon: 'mdiClose',
      color: 'text-black-dark',
      round: true,
    }
    const wrapper = shallowMount(Icon, {
      propsData: props,
    })

    // check props value
    expect(wrapper.props().icon).toBe(props.icon)

    // check if it has a class
    expect(wrapper.find('svg').classes()).toContain(props.color)

    // check rounded
    if (props.round) {
      expect(wrapper.classes()).toContain('rounded-full')
    }

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
