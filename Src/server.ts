import fastify from "fastify";


const Server = fastify({logger:true})

Server.get("/ping",function(request,reply){
    reply.send({message:"Pong"})
})

Server.listen({port:8080},(error,port)=>{
    if(error){
        Server.log.error(`An error occured ${error.message}`)
        process.exit(1);
    }
})