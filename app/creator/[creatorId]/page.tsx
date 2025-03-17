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
import StreamView from "@/app/comps/StreamView";
import { useEffect, useState } from 'react';

async function fetchCreatorId(params: Promise<{ creatorId: string }>) {
    const { creatorId } = await params;
    return creatorId;
}

export default function CreatorPage({ params }: { params: Promise<{ creatorId: string }> }) {
    const [creatorId, setCreatorId] = useState<string | null>(null);

    useEffect(() => {
        fetchCreatorId(params).then(setCreatorId);
    }, [params]);

    if (!creatorId) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            {/* <StreamView creatorId={creatorId} playVideo={false}/> */}
            <StreamView creatorId={creatorId} playVideo={false} />
        </div>
    );
}