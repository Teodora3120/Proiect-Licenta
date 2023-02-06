import React from 'react'
import { shallow } from 'enzyme'
import PatientSurvey from '../../views/dashboard/PatientSurvey'
it('should test PatientSurvey component', () => {
  const wrapper = shallow(<PatientSurvey />)
  expect(wrapper).toMatchSnapshot()
})
