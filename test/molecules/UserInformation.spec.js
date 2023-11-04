import { mount } from '@vue/test-utils'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import UserInformation from '@/components/molecules/UserInformation.vue'

Vue.use(VueI18n)
describe('Molecules UserInformation Check', () => {
  test('UserInformation Test', () => {
    const props = {
      userInfo: {
        firstname: 'test',
        lastname: 'test',
        email: 'test',
      },
      closeUserInfo: () => {},
    }
    const wrapper = mount(UserInformation, {
      propsData: props,
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
