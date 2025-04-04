import DBClient from "@/lib/db";
// import { error } from "console";
import { getServerSession } from "next-auth";
import {NextRequest,NextResponse} from "next/server"
import {z} from "zod";
const prisma = DBClient.getInstance().prisma;

const UpvoteSchema = z.object({
    streamId : z.string()
})

export async function POST(req:NextRequest){
    const session = await getServerSession();
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
    try{
        const data = UpvoteSchema.parse(await req.json());
        const res = await prisma.upvote.create({
            data:{
                userId:user.id,
                streamId:data.streamId
            }
        })
        return NextResponse.json({
            message:"a upvote is created",
            result:res
        })
    }catch(err){
        return NextResponse.json({
            message:"Error while upvoting, try again",
            error:err
        },{
            status:403
        })
    }
}