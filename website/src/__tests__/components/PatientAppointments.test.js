import React from 'react'
import { shallow } from 'enzyme'
import PatientAppointment from '../../views/dashboard/PatientAppointments'
it('should test PatientAppointment component', () => {
  const wrapper = shallow(<PatientAppointment/>)
  expect(wrapper).toMatchSnapshot()
})
