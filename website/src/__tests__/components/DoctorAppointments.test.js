import React from 'react'
import { shallow } from 'enzyme'
import DoctorAppointments from '../../views/dashboard/DoctorAppointments'
it('should test DoctorAppointments component', () => {
  const wrapper = shallow(<DoctorAppointments />)
  expect(wrapper).toMatchSnapshot()
})
