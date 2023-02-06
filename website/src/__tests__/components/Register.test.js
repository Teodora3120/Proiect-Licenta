import React from 'react'
import { shallow } from 'enzyme'
import Register from '../../views/examples/Register'
it('should test Register component', () => {
  const wrapper = shallow(<Register />)
  expect(wrapper).toMatchSnapshot()
})
