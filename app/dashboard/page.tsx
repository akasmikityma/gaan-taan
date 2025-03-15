"use client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import StreamView from "../comps/StreamView";

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const creatorId = user?.id as string;

  console.log("User:", user);
  console.log("creatorId is : ", creatorId);

  // Memoize the StreamView component to prevent unnecessary re-renders
  const streamView = useMemo(() => {
    if (!creatorId) return <div>Loading...</div>;
    return <StreamView creatorId={creatorId} playVideo={true} />;
  }, [creatorId]);

  return <div>{streamView}</div>;
}

