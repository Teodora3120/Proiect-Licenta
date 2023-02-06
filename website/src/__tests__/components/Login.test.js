import React from 'react'
import { shallow } from 'enzyme'
import Login from '../../views/examples/Login'
it('should test Login component', () => {
  const wrapper = shallow(<Login />)
  expect(wrapper).toMatchSnapshot()
})
