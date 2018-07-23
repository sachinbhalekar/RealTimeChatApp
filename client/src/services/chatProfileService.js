import Api from '@/services/api'

export default {
  fetchUserList (params) {
    return Api().post('getUserList', params)
  },
  fetchLastMsgs (params) {
    return Api().post('getLastMsgs', params)
  },
  fetchTodayChat (params) {
    return Api().post('getTodayChat', params)
  }
}
