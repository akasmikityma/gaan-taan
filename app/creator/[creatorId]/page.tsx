"use client";
import { useEffect, useState, useMemo } from "react";
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

    // Memoize the StreamView component to prevent unnecessary re-renders
    const streamView = useMemo(() => {
        if (!creatorId) return <div>Loading...</div>;
        return <StreamView creatorId={creatorId} playVideo={false} />;
    }, [creatorId]);

    return <div>{streamView}</div>;
}