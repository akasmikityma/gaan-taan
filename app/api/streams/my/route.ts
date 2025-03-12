import { getServerSession } from "next-auth";
import DBClient from "@/lib/db";
import { NextResponse } from "next/server";
const prisma = DBClient.getInstance().prisma;
export async function GET(req:Request){
    const session =await  getServerSession();

    // get the user and then if not user ,return some errorous response else find all the streams and return 
    const user = await prisma.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    })  
    if(!user){
        return NextResponse.json({
            message:"Unauthenticated"
        },{
            status:403
        })
    }
    const streams = await prisma.stream.findMany({
        where:{
            userId:user.id
        },
        include:{
            _count:{
                select:{
                    upvotes:true
                }
            },
            upvotes:{
                where:{
                    userId:user.id
                }
            }
        }
    })
    return NextResponse.json({
        streams: streams.map(({_count,...rest})=>({
            ...rest,
            upvotes:_count.upvotes,
            hasUpvoted : rest.upvotes.length?true:false
        }))
    })
}