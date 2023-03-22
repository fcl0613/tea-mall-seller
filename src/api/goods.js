import request from '@/utils/request'

export default {
    addGoods(obj) {
        return request({
            url: '/goods/add',
            method: 'post',
            data: obj
        })
    },
    updateGoods(obj) {
        return request({
            url: '/goods/update',
            method: 'post',
            data: obj
        })
    },
    getGoodsList(obj) {
        return request({
            url: '/goods/list',
            method: 'post',
            data: obj
        })
    },
    getGoodsInfo(id) {
        return request({
            url: '/goods/info',
            method: 'post',
            params: {
                id
            }
        })
    },
    deleteGoods(id) {
        return request({
            url: '/goods/delete',
            method: 'post',
            params: {
                id
            }
        })
    },
    updateStock(id, stock) {
        return request({
            url: '/goods/update/stock',
            method: 'post',
            params: {
                id,
                stock
            }
        })
    },
    updateStatus(id, status) {
        return request({
            url: '/goods/update/status',
            method: 'post',
            params: {
                id,
                status
            }
        })
    },
}