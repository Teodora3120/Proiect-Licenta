import React from 'react'
import { shallow } from 'enzyme'
import Footer from '../../components/Footers/AdminFooter'
test('should test AdminFooter component', () => {
  const wrapper = shallow(<Footer />)
  expect(wrapper).toMatchSnapshot()
})