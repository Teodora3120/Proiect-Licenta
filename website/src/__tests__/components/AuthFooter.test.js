import React from 'react'
import { shallow } from 'enzyme'
import Login from '../../components/Footers/AdminFooter'
test('should test AdminFooter component', () => {
  const wrapper = shallow(<Login />)
  expect(wrapper).toMatchSnapshot()
})