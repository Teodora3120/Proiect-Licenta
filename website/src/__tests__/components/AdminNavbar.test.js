import React from 'react'
import { shallow } from 'enzyme'
import AdminNavbar from '../../components/Navbars/AdminNavbar'
it('should test Register component', () => {
  const wrapper = shallow(< AdminNavbar />)
  expect(wrapper).toMatchSnapshot()
})
