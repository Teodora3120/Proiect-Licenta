import axios from "./index";

class NotificationApi {

    static async GetAllNotifications(userId) {
        return await axios.get(`/notification/get-notifications-by-user/${userId}`)
    }

    static async SetReadNotification(notificationId) {
        return await axios.put(`/notification/set-read-notification/${notificationId}`)
    }

    static async DeleteNotification(notificationId) {
        return await axios.delete(`/notification/delete-notification/${notificationId}`)
    }

}

export default NotificationApi