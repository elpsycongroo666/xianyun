import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
    // 插件的方法
  window.onNuxtReady(() => {
    createPersistedState({
        key: 'store', //存进本地存储的时候的键名称
        paths: []
    })(store)
  })
}