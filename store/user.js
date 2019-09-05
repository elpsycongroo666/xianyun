// state 是仓库数据
// mutations 是同步修改state的数据

// 用户管理
export const state = () => {
    return {
        userInfo: {
            token: '',
            user: {}
        }
    }
}

export const mutations = {
    // 设置用户信息，mutations下面的方法第一个参数固定是state
    // data参数不是必须的，是调用方法时候传入的参数
    setUserInfo(state, data) {
        state.userInfo = data
    },
    // 退出
    clearUserInfo(state) {
        state.userInfo = {
            token: '',
            user: {}
        }
    }
}