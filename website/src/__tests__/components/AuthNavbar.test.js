import React from 'react'
import { shallow } from 'enzyme'
import AuthNavbar from '../../components/Navbars/AuthNavbar'
it('should test Register component', () => {
  const wrapper = shallow(< AuthNavbar />)
  expect(wrapper).toMatchSnapshot()
})