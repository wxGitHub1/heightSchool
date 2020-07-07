var getRouter = (name,routers) =>{
    let dr = null
    for (let index = 0; index < routers.length; index++) {
        let router = routers[index];
        if(router.name == name){
            return router
        }
        if(router.children != undefined){
            dr =  getRouter(name,router.children)
        }
    }
    return dr
}

export default {
    getRouter,//router
}