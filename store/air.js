export const state = () => {
    return {
        infoData: {
            seat_infos : {} //这里是也因为通过axiso请求之后 才能赋值的 所以也是异步操作 为了防止org_settle_price undefined所以就要先注册一个对象
        }
    }
}

export const mutations = {
    // 修改机票信息
    setInfoData(state, data) {
        state.infoData = data
    }
}