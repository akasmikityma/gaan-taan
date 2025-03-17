"use client"
import { useSession } from "next-auth/react"
import StreamView from "../comps/StreamView"
interface Video{
    "id":string,
    "type":string,
    "url":string,
    "extractedId":string,
    "title":string,
    "smallImg":string,
    "bigImg":string,
    "active":string,
    "usreId":string,
    "upvotes":number,
    "hasUpvoted":boolean
}
const REFRESH_INTERVAL = 10*1000;
// const creatorId = "803717aa-b00b-4907-99ba-880a91e1fa3d"
export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const creatorId = user?.id as string;
  console.log("User:", user);
  console.log("creatorId is : ",creatorId);
  return (
    <StreamView creatorId={creatorId} playVideo={true}/>
  )
}

