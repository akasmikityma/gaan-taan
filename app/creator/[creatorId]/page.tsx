"use client";
import { use } from 'react';
import StreamView from "@/app/comps/StreamView";

export default async function ({ params }: { params: Promise<{ creatorId: string }> }) {
    const { creatorId } = await params; // Unwrap the params Promise

    return (
        <div>
            <StreamView creatorId={creatorId} playVideo={false}/>
        </div>
    );
}