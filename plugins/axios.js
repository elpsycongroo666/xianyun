import {Message} from 'element-ui'

export default ({$axios,redirect}) => {
    // 错误拦截，onError用于错误拦截
    $axios.onError((res)=>{
        // console.log(res.response)
        const { message,statusCode } = res.response.data
        if(statusCode === 400){
            // 引入element-ui的message
            Message.error(message)
        }

        if(statusCode === 401 || statusCode === 403){
            Message.error('请登录~')
            // 跳转到登陆页
            redirect('/user/login')
        }
    })
}