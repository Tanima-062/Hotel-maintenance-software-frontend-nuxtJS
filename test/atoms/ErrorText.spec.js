import { shallowMount } from '@vue/test-utils'
import ErrorText from '@/components/atoms/ErrorText.vue'

describe('Atoms ErrorText Check', () => {
  test('ErrorText Test', () => {
    const props = {
      errText: 'it has some error',
    }
    const wrapper = shallowMount(ErrorText, {
      propsData: props,
    })

    // check props value
    expect(wrapper.props().errText).toBe(props.errText)

    // check error Text
    expect(wrapper.find('p').text()).toBe(props.errText)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
