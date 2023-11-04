import { shallowMount } from '@vue/test-utils'
import Btn from '@/components/atoms/Btn.vue'

describe('Atoms Btn Check', () => {
  test('Btn Blue Test', () => {
    const props = {
      color: 'blue',
    }
    const wrapper = shallowMount(Btn, {
      propsData: props,
    })

    // check if props has correct value
    expect(wrapper.props().color).toBe(props.color)

    // find element and check if exist
    expect(wrapper.find('button').exists()).toBe(true)

    // check emit event
    wrapper.vm.$emit('click')
    expect(wrapper.emitted().click).toBeTruthy()

    // check if it exists
    expect(wrapper.exists()).toBe(true)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Btn Gray Test', () => {
    const props = {
      color: 'gray',
    }
    const wrapper = shallowMount(Btn, {
      propsData: props,
    })

    // check if props has correct value
    expect(wrapper.props().color).toBe(props.color)

    // find element and check if exist
    expect(wrapper.find('button').exists()).toBe(true)

    // check emit event
    wrapper.vm.$emit('click')
    expect(wrapper.emitted().click).toBeTruthy()

    // check if it exists
    expect(wrapper.exists()).toBe(true)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Btn Red Test', () => {
    const props = {
      color: 'red',
    }
    const wrapper = shallowMount(Btn, {
      propsData: props,
    })

    // check if props has correct value
    expect(wrapper.props().color).toBe(props.color)

    // find element and check if exist
    expect(wrapper.find('button').exists()).toBe(true)

    // check emit event
    wrapper.vm.$emit('click')
    expect(wrapper.emitted().click).toBeTruthy()

    // check if it exists
    expect(wrapper.exists()).toBe(true)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Btn Green Test', () => {
    const props = {
      color: 'green',
    }
    const wrapper = shallowMount(Btn, {
      propsData: props,
    })

    // check if props has correct value
    expect(wrapper.props().color).toBe(props.color)

    // find element and check if exist
    expect(wrapper.find('button').exists()).toBe(true)

    // check emit event
    wrapper.vm.$emit('click')
    expect(wrapper.emitted().click).toBeTruthy()

    // check if it exists
    expect(wrapper.exists()).toBe(true)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Btn White Test', () => {
    const props = {
      color: 'white',
    }
    const wrapper = shallowMount(Btn, {
      propsData: props,
    })

    // check if props has correct value
    expect(wrapper.props().color).toBe(props.color)

    // find element and check if exist
    expect(wrapper.find('button').exists()).toBe(true)

    // check emit event
    wrapper.vm.$emit('click')
    expect(wrapper.emitted().click).toBeTruthy()

    // check if it exists
    expect(wrapper.exists()).toBe(true)

    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
