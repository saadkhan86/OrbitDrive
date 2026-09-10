import fastify from "fastify";

declare module "fastify"{
    interface FastifyRequest {
        startTime : number
    }
}
const Server = fastify({logger:true})

Server.addHook("onRequest",async(request)=>{
    request.startTime = performance.now()
})
Server.addHook("onSend",async(request,reply)=>{
    reply.header("X-Reponse-Time",`${(request.startTime - performance.now()).toFixed(2)} ms`)
})

Server.get("/ping",function(request,reply){
    return ({message:"Pong"})
})

Server.post("/",{schema:{
    body:{
        type:"object",
        required:["id"],
        properties:{
            id:{type:"string"}
        }
    }
}},async(request,reply)=>{
    reply.send({type:request.method})
})

Server.listen({port:8080},(error,port)=>{
    if(error){
        Server.log.error(`An error occured ${error.message}`)
        process.exit(1);
    }
})