import { expect } from 'chai'
import sinon from 'sinon'
import { shallow, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import BasicPanel from '@/components/ml/BasicPanel.vue'

const localVue = createLocalVue()
localVue.use(Vuetify)

describe('BasicPanel.vue', () => {
  it('renders header when passed', () => {
    const jobs: any[] = []
    const wrapper = shallow(BasicPanel, {
      propsData: { jobs }
    })
    expect(wrapper.text()).to.include('Choose algorithm')
  })
})
