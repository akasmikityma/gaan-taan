// "use client";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Share2, PlayCircle, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// // @ts-expect-error: YouTubePlayer has no types available
// import YouTubePlayer from "youtube-player";
// import Image from 'next/image';

// interface Video {
//     id: string;
//     type: string;
//     url: string;
//     extractedId: string;
//     title: string;
//     smallImg: string;
//     bigImg: string;
//     active: string;
//     usreId: string;
//     upvotes: number;
//     hasUpvoted: boolean;
// }

// const REFRESH_INTERVAL = 10 * 1000;

// export default function StreamView({
//     creatorId,
//     playVideo = false
// }: {
//     creatorId: string,
//     playVideo: boolean
// }) {
//     const [inputValue, setInputValue] = useState("");
//     const [queue, setQueue] = useState<Video[]>([]);
//     const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
//     const [playNextLoader, setPlayNextLoader] = useState(false);
//     const videoPlayerRef = useRef<HTMLDivElement>(null);

//     const refreshStreams = useCallback(async () => {
//         try {
//             const res = await fetch(`/api/streams?creatorId=${creatorId}`, {
//                 credentials: "include"
//             });
//             if (!res.ok) throw new Error("Failed to fetch streams");
//             const json = await res.json();
//             console.log(`/api/streams?creatorId=${creatorId} results`, json);
//             setQueue(json.streams.sort((a: { upvotes: number }, b: { upvotes: number }) => a.upvotes < b.upvotes ? -1 : 1) || []); // Ensure empty array if undefined
//         } catch (err) {
//             console.error("Error fetching streams:", err);
//         }
//     }, [creatorId]);

//     useEffect(() => {
//         refreshStreams();
//         const interval = setInterval(() => {
//             refreshStreams();
//         }, REFRESH_INTERVAL);

//         return () => clearInterval(interval);
//     }, [creatorId, refreshStreams]);

//     const handleSubmit = async () => {
//         if (!inputValue.trim()) return; // Prevent empty submission

//         const res = await fetch("/api/streams", {
//             method: "POST",
//             body: JSON.stringify({
//                 creatorId: creatorId,
//                 url: inputValue
//             })
//         });
//         setQueue([...queue, await res.json()]);
//         setInputValue("");
//     };

//     const handleVote = async (id: string, isUpvote: boolean) => {
//         try {
//             const response = await fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ streamId: id }),
//             });

//             if (!response.ok) throw new Error("Vote failed");

//             // Refresh queue after vote
//             refreshStreams();
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const playNext = useCallback(async () => {
//         setPlayNextLoader(true);
//         console.log("clicked on the playnext")
//         try {
//             if (queue.length > 0) {
//                 const data = await fetch("api/streams/next", {
//                     method: "GET"
//                 })
//                 const json = await data.json();
//                 setCurrentVideo(json.stream)
//             }
//         } catch (err) {
//             console.error(err);
//         }
//         setPlayNextLoader(false);
//     }, [queue]);

//     useEffect(() => {
//         if (videoPlayerRef.current === null) return;
//         const player = YouTubePlayer(videoPlayerRef.current);

//         player.loadVideoById(currentVideo?.extractedId || "");

//         player.playVideo();

//         function eventHandler(event: { data: number }) {
//             console.log(event.data);
//             if (event.data === 0) {
//                 playNext();
//             }
//         }
//         player.on('stateChange', eventHandler);
//         return () => {
//             player.destroy();
//         }
//     }, [currentVideo, videoPlayerRef, playNext])

//     const handleShare = () => {
//         const sharableLink = `${window.location.hostname}/creator/${creatorId}`;
//         navigator.clipboard.writeText(sharableLink).then(() => {
//             toast.success("link copied to clipboard", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined
//             })
//         }, (err) => {
//             console.error("Could not copy", err);
//             toast.error("Failed to copy link .. Please try again ", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined
//             })
//         })
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-10">
//             <div className="container mx-auto px-4 py-8">
//                 <div className="grid gap-6">
//                     {/* Header */}
//                     <div className="flex items-center justify-between">
//                         <h1 className="text-2xl font-bold">Song Voting Queue</h1>
//                         <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
//                             <Share2 className="h-4 w-4" />
//                             Share
//                         </Button>
//                     </div>

//                     {/* Add to Queue Section */}
//                     <Card className="border-2 border-primary/10">
//                         <CardContent className="pt-6">
//                             <div className="grid gap-4">
//                                 <Input placeholder="Paste YouTube link here" className="bg-white" value={inputValue} onChange={(e) =>
//                                     setInputValue(e.target.value)
//                                 } />
//                                 <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSubmit}>Add to Queue</Button>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Now Playing Section */}
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Now Playing</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="aspect-video w-full bg-muted/30 rounded-lg flex flex-col items-center border justify-center">
//                                 {currentVideo ? (
//                                     <>
//                                         {!playNextLoader &&
//                                             <div className="w-full h-full">
//                                                 <div ref={videoPlayerRef} key={"bishal"} className="w-full h-full" />
//                                             </div>
//                                         }

//                                         {playNextLoader && <Image src={currentVideo.bigImg} alt={currentVideo.title} layout="fill" objectFit="cover" className="w-full h-full object-cover rounded" />}

//                                         <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
//                                     </>
//                                 ) : (
//                                     <p className="text-center py-8 text-gray-400">No video playing</p>
//                                 )}

//                             </div>
//                             {playVideo && <Button variant="outline" onClick={playNext} className="w-full mt-4 gap-2">
//                                 <PlayCircle className="h-4 w-4" />
//                                 {playNextLoader ? "Loading.." : "play next"}
//                             </Button>}
//                         </CardContent>
//                     </Card>

//                     {/* Upcoming Songs Section */}
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Upcoming Songs</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid gap-4">
//                                 {queue.map((song, i) => (
//                                     <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/10 transition-colors">
//                                         <div className="h-12 w-20 bg-muted/30 rounded-md overflow-hidden border">
//                                             <Image
//                                                 src={song.smallImg}
//                                                 alt={`${song.title} Thumbnail`}
//                                                 layout="fill"
//                                                 objectFit="cover"
//                                                 className="object-cover w-full h-full"
//                                             />
//                                         </div>
//                                         <div className="flex-1">
//                                             <h3 className="font-medium">{song.title}</h3>
//                                             <p className="text-sm text-muted-foreground">Added by User</p>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80"
//                                                 onClick={() => handleVote(song.id, song.hasUpvoted ? false : true)}
//                                             >
//                                                 {song.hasUpvoted ? <ThumbsDown className="h-4 w-4 mr-1" /> : <ThumbsUp className="h-4 w-4 mr-1" />}
//                                                 <span>{song.upvotes}</span>
//                                             </Button>
//                                             <Button variant="ghost" size="icon">
//                                                 <MoreVertical className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </CardContent>
//                     </Card>
//                     <ToastContainer />
//                 </div>
//             </div>
//         </div>
//     )
// }

"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, PlayCircle, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
// @ts-expect-error: YouTubePlayer has no types available
import YouTubePlayer from "youtube-player";
import Image from "next/image";

interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
}

const REFRESH_INTERVAL = 10 * 1000;

export default function StreamView({
  creatorId,
  playVideo = false,
}: {
  creatorId: string;
  playVideo: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [playNextLoader, setPlayNextLoader] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const refreshStreams = useCallback(async () => {
    try {
      const res = await fetch(`/api/streams?creatorId=${creatorId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch streams");
      const json = await res.json();
      setQueue(
        json.streams.sort((a: Video, b: Video) => b.upvotes - a.upvotes) || []
      );
    } catch (err) {
      console.error("Error fetching streams:", err);
    }
  }, [creatorId]);

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshStreams]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    try {
      const res = await fetch("/api/streams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ creatorId, url: inputValue }),
      });

      if (!res.ok) throw new Error("Failed to add video");

      const newVideo = await res.json();
      setQueue((prev) => [...prev, newVideo]);
      setInputValue("");
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleVote = async (id: string, isUpvote: boolean) => {
    try {
      setQueue((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, upvotes: v.upvotes + (isUpvote ? 1 : -1), hasUpvoted: isUpvote }
            : v
        )
      );

      const response = await fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamId: id }),
      });

      if (!response.ok) throw new Error("Vote failed");

      refreshStreams();
    } catch (error) {
      console.error("Voting error:", error);
    }
  };

  const playNext = useCallback(async () => {
    setPlayNextLoader(true);

    try {
      const res = await fetch("/api/streams/next");
      if (!res.ok) throw new Error("Failed to fetch next video");

      const json = await res.json();
      setCurrentVideo(json.stream);
    } catch (err) {
      console.error(err);
    } finally {
      setPlayNextLoader(false);
    }
  }, []);

  useEffect(() => {
    if (!currentVideo || !videoPlayerRef.current) return;

    if (!playerRef.current) {
      playerRef.current = YouTubePlayer(videoPlayerRef.current);
    }

    const player = playerRef.current;
    player.loadVideoById(currentVideo.extractedId);
    player.playVideo();

    function onStateChange(event: { data: number }) {
      if (event.data === 0) {
        playNext();
      }
    }

    player.on("stateChange", onStateChange);
    return () => {
      player.off("stateChange", onStateChange);
    };
  }, [currentVideo, playNext]);

  const handleShare = () => {
    const sharableLink = `${window.location.origin}/creator/${creatorId}`;
    navigator.clipboard.writeText(sharableLink).then(
      () => toast.success("Link copied to clipboard!"),
      () => toast.error("Failed to copy link, try again.")
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Song Voting Queue</h1>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <Card className="border-2 border-primary/10">
            <CardContent className="pt-6">
              <Input
                placeholder="Paste YouTube link here"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button className="w-full mt-2 bg-primary hover:bg-primary/90" onClick={handleSubmit}>
                Add to Queue
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/30 flex items-center justify-center border rounded-lg">
                {currentVideo ? (
                  <div ref={videoPlayerRef} className="w-full h-full" />
                ) : (
                  <p className="text-center py-8 text-gray-400">No video playing</p>
                )}
              </div>
              {playVideo && (
                <Button variant="outline" onClick={playNext} className="w-full mt-4">
                  <PlayCircle className="h-4 w-4" />
                  {playNextLoader ? "Loading..." : "Play Next"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Songs</CardTitle>
            </CardHeader>
            <CardContent>
              {queue.map((song) => (
                <div key={song.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/10">
                  <Image src={song.smallImg} alt={song.title} width={80} height={48} className="rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-medium">{song.title}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleVote(song.id, !song.hasUpvoted)}>
                    {song.hasUpvoted ? <ThumbsDown /> : <ThumbsUp />}
                    {song.upvotes}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
