import axios from './index'

class ProcedureApi {
  static async GetProcedures() {
    return await axios.get('/Procedures')
  }
}

export default ProcedureApi