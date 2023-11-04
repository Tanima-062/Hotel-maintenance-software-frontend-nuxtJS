import { mount } from '@vue/test-utils'
import ManualModal from '@/components/molecules/ManualModal.vue'
import IconBtn from '@/components/atoms/IconBtn.vue'

describe('Molecules ManualModal Check', () => {
  test('ManualModal Test', () => {
    const props = {
      manualData: {
        title: 'test',
        separateOption: 'arrow',
        imageList: [
          '/images/hotel-guide01-1.jpg',
          '/images/hotel-guide01-2.jpg',
        ],
      },
      closeManualModal: () => {},
    }
    const wrapper = mount(ManualModal, { propsData: props, stubs: { IconBtn } })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
