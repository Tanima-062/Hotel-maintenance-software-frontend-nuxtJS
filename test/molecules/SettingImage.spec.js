import { mount } from '@vue/test-utils'
import SettingImage from '@/components/molecules/SettingImage.vue'
import Icon from '@/components/atoms/Icon.vue'
import Btn from '@/components/atoms/Btn.vue'
import ErrorText from '@/components/atoms/ErrorText.vue'

describe('Molecules SettingImage Check', () => {
  test('SettingImage Test', () => {
    const props = {
      previewFile: { name: 'test', src: 'test' },
    }
    const wrapper = mount(SettingImage, {
      propsData: props,
      stubs: {
        Icon,
        Btn,
        ErrorText,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
