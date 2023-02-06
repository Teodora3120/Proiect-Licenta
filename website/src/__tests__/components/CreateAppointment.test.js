import React from 'react'
import { shallow } from 'enzyme'
import CreateAppointment from '../../views/dashboard/CreateAppointment'
it('should test CreateAppointment component', () => {
  const wrapper = shallow(< CreateAppointment />)
  expect(wrapper).toMatchSnapshot()
})