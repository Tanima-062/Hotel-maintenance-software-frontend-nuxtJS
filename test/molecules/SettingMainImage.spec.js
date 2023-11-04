import { mount } from '@vue/test-utils'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import SettingMainImage from '@/components/molecules/SettingMainImage.vue'
import Icon from '@/components/atoms/Icon.vue'
import IconBtn from '@/components/atoms/IconBtn.vue'

Vue.use(VueI18n)
describe('Molecules SettingMainImage.vue Check', () => {
  test('SettingMainImage.vue Test', () => {
    const wrapper = mount(SettingMainImage, {
      stubs: {
        Icon,
        IconBtn,
      },
      mocks: {
        $t: (msg) => msg,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
