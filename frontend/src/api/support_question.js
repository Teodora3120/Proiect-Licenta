import axios from "./index";

class SupportQuestionApi {

    static async GetAllQuestions() {
        return await axios.get(`/support`)
    }

    static async CreateSupportQuestion(data) {
        return await axios.post('/support/create-question', data)
    }

    static async AnswerSupportQuestion(data) {
        return await axios.put('/support/answer-question', data)
    }

}

export default SupportQuestionApi