
import http from 'http'
export default class MProxy {
    static port:6080
    constructor(options:any){

    }

    run():MProxy{
        http.get({
            hostname:'localhost',
            port:this.port,
            path:'/',
            agent:false
        })
        return this;
    }
}