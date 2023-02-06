import React from 'react'
import { shallow } from 'enzyme'
import DoctorSchedule from '../../views/dashboard/DoctorSchedule'
it('should test DoctorSchedule component', () => {
  const wrapper = shallow(< DoctorSchedule />)
  expect(wrapper).toMatchSnapshot()
})