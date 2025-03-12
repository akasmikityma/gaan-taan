"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, PlayCircle, Music, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react"
import {toast,ToastContainer} from "react-toastify"
//@ts-ignore
import YouTubePlayer from "youtube-player"
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
export default function StreamView({
    creatorId,
    playVideo = false
}:{
    creatorId:string,
    playVideo:boolean
}) {
    const [inputValue,setInputValue] = useState("");
    const [queue,setQueue] = useState<Video[]>([]);
    const [currentVideo,setCurrentVideo] = useState<Video|null>(null);
    const [playNextLoader, setPlayNextLoader] = useState(false);
    // const iframeRef = useRef<HTMLIFrameElement>(null);
    const videoPlayerRef = useRef<HTMLDivElement>(null);
    async function refreshStreams() {
        try {
            const res = await fetch(`/api/streams?creatorId=${creatorId}`, {
              credentials: "include"
              });
              if (!res.ok) throw new Error("Failed to fetch streams");
              const json = await res.json();
              console.log(`/api/streams?creatorId=${creatorId} results`,json);
              setQueue(json.streams.sort((a:any,b:any)=> a.upvotes<b.upvotes ? -1:1) || []); // Ensure empty array if undefined
              // setCurrentVideo(json.activeStream.stream);
            } catch (err) {
              console.error("Error fetching streams:", err);
          }
      }

      useEffect(() => {
          refreshStreams();
          const interval = setInterval(() => {
              refreshStreams();
          }, REFRESH_INTERVAL);

          return () => clearInterval(interval);
      }, [creatorId]); 
    

    const handleSubmit = async() => {
      if (!inputValue.trim()) return; // Prevent empty submission

      const res = await fetch("/api/streams",{
        method:"POST",
        body:JSON.stringify({
          creatorId:creatorId,
          url:inputValue
        })
      })
      setQueue([...queue, await res.json()]);
      setInputValue("");
  };
    // something related to upvote and stuff>>
    const handleVote = async (id: string, isUpvote: boolean) => {
      try {
          const response = await fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ streamId: id }),
          });
  
          if (!response.ok) throw new Error("Vote failed");
  
          // Refresh queue after vote
          refreshStreams();
      } catch (error) {
          console.error(error);
      }
  };
    
    // related to setting the current playing video/stream
    const playNext =async()=>{
        setPlayNextLoader(true);
        console.log("clicked on the playnext")
        try{
          if(queue.length>0){
            const data = await fetch("api/streams/next",{
             method:"GET"
            })
            const json =await data.json();
             setCurrentVideo(json.stream)
             // setQueue(queue.slice(1))
         }
        }catch(err){
            console.error(err);
        }
        setPlayNextLoader(false);
    }

    // useEffect(() => {
    //     const handleIframeMessage = (event: MessageEvent) => {
    //       if (event.origin !== "https://www.youtube.com") return;
    
    //       const data = JSON.parse(event.data);
    //       console.log('the data inside the useEffect',data)
    //       if (data.event === "onStateChange" && data.info === 0) {
    //         playNext();
    //       }
    //     };
    
    //     window.addEventListener("message", handleIframeMessage);
    
    //     return () => {
    //       window.removeEventListener("message", handleIframeMessage);
    //     };
    //   }, []);

    useEffect(()=>{
      // let player =  YouTubePlayer('video-player');
      if(videoPlayerRef.current === null) return;
      let player =  YouTubePlayer(videoPlayerRef.current);
      
      // 'loadVideoById' is queued until the player is ready to receive API calls.
      player.loadVideoById(currentVideo?.extractedId || "");
      
      // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
      player.playVideo();
      
      // 'stopVideo' is queued after 'playVideo'.
      function eventHandler(event:any){
        console.log(event.data);
        if(event.data === 0){
          playNext();
        }
      }
      player.on('stateChange', eventHandler);
      return ()=>{
        player.destroy();
      }
    },[currentVideo,videoPlayerRef])
    // handler for sharing the queue and stuff>>
    const handleShare = ()=>{
        const sharableLink =`${window.location.hostname}/creator/${creatorId}`;
        navigator.clipboard.writeText(sharableLink).then(()=>{
            toast.success("link copied to clipboard",{
                position:"top-right",
                autoClose:3000,
                hideProgressBar:false,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined
            })
        },(err)=>{
            console.error("Could not copy",err);
            toast.error("Failed to copy link .. Please try again ",{
                position:"top-right",
                autoClose:3000,
                hideProgressBar:false,
                closeOnClick:true,
                pauseOnHover:true,
                draggable:true,
                progress:undefined
            })
        })
    }
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Song Voting Queue</h1>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Add to Queue Section */}
          <Card className="border-2 border-primary/10">
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <Input placeholder="Paste YouTube link here" className="bg-white" value={inputValue} onChange={(e)=>
                    setInputValue(e.target.value)
                }/>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSubmit}>Add to Queue</Button>
              </div>
            </CardContent>
          </Card>

          {/* Now Playing Section */}
          <Card>
            <CardHeader>
              <CardTitle>Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full bg-muted/30 rounded-lg flex flex-col items-center border justify-center">
                {/* <p className="text-muted-foreground">No video playing</p>
                 */}
                {currentVideo ? (
                    <>
                      {!playNextLoader &&
                      <div className="w-full h-full">
                        <div ref={videoPlayerRef} key={"bishal"} className="w-full h-full"/>
                      </div>
                      // <iframe ref={iframeRef} className="w-full h-full border-none"
                      //   src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1&enablejsapi=1`}
                      //   allow="autoplay"
                      // ></iframe>
                      }

                      {playNextLoader && <img  src={currentVideo.bigImg} className="w-full h-full object-cover rounded" />}

                      <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                    </>
                  ) : (
                    <p className="text-center py-8 text-gray-400">No video playing</p>
                  )}

              </div>
              {playVideo && <Button  variant="outline" onClick={playNext} className="w-full mt-4 gap-2">
                <PlayCircle className="h-4 w-4"  />
                {playNextLoader?"Loading..":"play next"}
              </Button>}
            </CardContent>
          </Card>

          {/* Upcoming Songs Section */}
          <Card>
            <CardHeader>
                <CardTitle>Upcoming Songs</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                {queue.map((song, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/10 transition-colors">
                    <div className="h-12 w-20 bg-muted/30 rounded-md overflow-hidden border">
                        <img 
                        src={song.smallImg} // Replace with actual image URLs
                        alt={`${song.title} Thumbnail`}
                        className="object-cover w-full h-full" 
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium">{song.title}</h3>
                        <p className="text-sm text-muted-foreground">Added by User</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80"
                      onClick={()=>handleVote(song.id,song.hasUpvoted?false:true)}
                      >
                        {song.hasUpvoted?<ThumbsDown className="h-4 w-4 mr-1" />:<ThumbsUp className="h-4 w-4 mr-1" />}
                        <span>{song.upvotes}</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
            <ToastContainer/>
        </div>
      </div>
    </div>
  )
}

