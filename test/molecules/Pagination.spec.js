import { mount } from '@vue/test-utils'
import Pagination from '@/components/molecules/Pagination.vue'

describe('Molecules Pagination Check', () => {
  test('Pagination Test', () => {
    const props = {
      pageCountItems: [
        {
          name: 'test 1',
          value: 1,
        },
        {
          name: 'test 2',
          value: 2,
        },
      ],
      selectedCount: {
        name: 'test 1',
        value: 1,
      },
    }
    const wrapper = mount(Pagination, { propsData: props })
    // check if it is a vue element
    expect(wrapper.vm).toBeTruthy()

    // check Snapshot
    expect(wrapper.element).toMatchSnapshot()
  })
})
