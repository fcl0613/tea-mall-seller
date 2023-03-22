import request from '@/utils/request'

export default {
    getAllCategory() {
        return request({
            url: '/category/all',
            method: 'get'
        })
    }
}