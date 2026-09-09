import fastify from "fastify";
const Fastify = fastify({logger:true})
Fastify.get("/hello",function(request,reply){
    Fastify.log.info("/hello route")
    reply.send({message:"Hello"})
})
Fastify.listen({port:8080},(error,port)=>{
    Fastify.log.info(`Server is Lintening on PORT ${port}`)
    if(error){
        Fastify.log.error(`An error occured ${error.message}`)
        process.exit(1);
    }
})