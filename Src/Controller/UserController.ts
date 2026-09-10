import type { FastifyReply, FastifyRequest } from "fastify";

export const UserController = {
    signup:async(request:FastifyRequest,reply:FastifyReply)=>{
        return reply.status(201).send({message:"Signup route hit"})
    },
    login:async(request:FastifyRequest,reply:FastifyReply)=>{
        return reply.status(200).send({message:"Login route hit"})
    },
    
}