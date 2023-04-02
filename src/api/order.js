import request from '@/utils/request'

export default {
    getOrderList(obj) {
        return request({
            url: 'order/list',
            method: 'post',
            data: obj
        })
    },
    getOrderDetail(id) {
        return request({
            url: 'order/detail',
            method: 'get',
            params: {
                id
            }
        })
    },
    shipmentsOrder(obj) {
        return request({
            url: 'order/shipments',
            method: 'post',
            data: obj
        })
    },
    cancelOrder(id) {
        return request({
            url: 'order/cancel',
            method: 'post',
            params: {
                id
            }
        })
    }
}