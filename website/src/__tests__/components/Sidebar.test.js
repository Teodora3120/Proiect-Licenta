import React from 'react'
import { shallow } from 'enzyme'
import Sidebar from '../../components/Sidebar/Sidebar'
test('should test Sidebar component', () => {
  const wrapper = shallow(<Sidebar />)
  expect(wrapper).toMatchSnapshot()
})