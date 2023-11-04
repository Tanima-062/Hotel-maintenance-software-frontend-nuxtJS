import { mount } from '@vue/test-utils'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import DatePicker from 'vue2-datepicker'
import DateSelect from '@/components/molecules/DateSelect.vue'
import Btn from '@/components/atoms/Btn.vue'
import Icon from '@/components/atoms/Icon.vue'

Vue.use(VueI18n)
Vue.use(DatePicker)
describe('Molecules DateSelect Check', () => {
  const props = {
    dateSelected: new Date('2021/01/01'),
  }
  test('DateSelect Test', () => {
    const wrapper = mount(DateSelect, {
      propsData: props,
      mocks: {
        $t: (msg) => msg,
      },
      stubs: {
        Btn,
        Icon,
      },
    })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
