"use client";
import { useEffect, useState } from 'react';
import StreamView from "@/app/comps/StreamView";

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
            <StreamView creatorId={creatorId} playVideo={false} />
        </div>
    );
}