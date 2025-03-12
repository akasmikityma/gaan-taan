"use client"
// import StreamView from "@/app/comps/StreamView"
// export default function({
//     params:{
//         creatorId
//     }
// }:{
//     params:{
//         creatorId:string
//     }
// }){
//     return <div>
//         <StreamView creatorId={creatorId}/>
//     </div>
// }
"use client";
import { use } from 'react';
import StreamView from "@/app/comps/StreamView";

export default function ({ params }: { params: { creatorId: string } }) {
    const { creatorId } = params; // Unwrap the params Promise

    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false}/>
        </div>
    );
}