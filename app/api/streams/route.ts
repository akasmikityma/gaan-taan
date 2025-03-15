import DBClient from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// @ts-expect-error: ytSearchApi has no types available
import ytSearchApi from "youtube-search-api";
import { getServerSession } from "next-auth";

const YT_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;

const prisma = DBClient.getInstance().prisma;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    const data = CreateStreamSchema.parse(body);
    const match = data.url.match(YT_REGEX);
    const extractedId = match ? match[1] : null;

    if (!extractedId) {
      return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 400 });
    }

    const res = await ytSearchApi.GetVideoDetails(extractedId);
    console.log("YouTube API response:", res);

    if (!res || !res.title) {
      console.log("Invalid API response:", res);
      return NextResponse.json({ message: "Invalid video data from YouTube" }, { status: 500 });
    }

    const thumbnails = res.thumbnail?.thumbnails || [];
    thumbnails.sort((a: { width: number }, b: { width: number }) => (a.width < b.width ? -1 : 1));
    
    const existingActiveStream = await prisma.stream.count({
      where:{
        userId:data.creatorId,
        played:false
      }
    })

    if(existingActiveStream){
      return NextResponse.json({
        message:"You already have an active stream"
      },{
        status:411
      })
    }   

    const stream = await prisma.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "YouTube",
        title: res.title ?? "Can't find the video",
        smallImg: thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigImg: thumbnails[thumbnails.length - 1]?.url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
      },
    });

    return NextResponse.json({
      ...stream,
      hasUpvoted: false,
      upvotes: 0,
    });
  } catch (err) {
    console.error("Error in POST /api/streams:", err);
    return NextResponse.json({ message: "Error while adding a stream" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
      const creatorId = req.nextUrl.searchParams.get("creatorId");
      const session  = await getServerSession();

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
      
      if (!creatorId) {
          return NextResponse.json({
              message: "Error: creatorId is required"
          }, {
              status: 400
          });
      }

      const [streams,activeStream] = await Promise.all([ await prisma.stream.findMany({
          where: { userId: creatorId, played:false },
          include: {
              _count: {
                  select: { upvotes: true }
              },
              upvotes: {
                  where: { userId: user.id }
              }
          }
      }),prisma.currentStream.findFirst({
        where:{
          userId:creatorId
        },
        include:{
          stream:true
        }
      })]);

      if (!streams.length) {
          return NextResponse.json({
              message: "No streams found",
              streams: []
          });
      }

      return NextResponse.json({
          streams: streams.map(({ _count, ...rest }) => ({
              ...rest,
              upvotes: _count.upvotes,
              hasUpvoted: rest.upvotes.length ? true : false
          })),
          activeStream
      });
  } catch (err) {
      console.error("GET /api/streams failed:", err);
      return NextResponse.json({
          message: "Internal server error"
      }, { status: 500 });
  }
}
