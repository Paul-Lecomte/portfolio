"use client";

import { useEffect, useRef, useState } from "react";

interface MediaPlayerProps {
    mediaUrl?: string;
    onClose: () => void;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ mediaUrl, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [url, setUrl] = useState<string | null>(null);
    const mediaRef = useRef<HTMLMediaElement | null>(null);

    useEffect(() => {
        let loadedUrl = mediaUrl;

        if (!loadedUrl) {
            const saved = localStorage.getItem("currentFile");
            if (saved) {
                const file = JSON.parse(saved);
                loadedUrl = file?.fileUrl || null;
            }
        }

        setUrl(loadedUrl ?? null);
    }, [mediaUrl]);

    const handlePlayPause = () => {
        if (mediaRef.current) {
            if (isPlaying) {
                mediaRef.current.pause();
            } else {
                mediaRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (!url) {
        return <div className="text-white p-4">⚠️ No media loaded.</div>;
    }

    return (
        <div className="w-full h-full bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
            <video
                ref={mediaRef}
                src={url}
                controls
                className="rounded-lg w-full h-full"
                onClick={handlePlayPause}
            />
            <div className="flex justify-between w-full mt-2">
                <button onClick={handlePlayPause} className="bg-blue-500 p-2 rounded-md text-white">
                    {isPlaying ? "Pause" : "Play"}
                </button>
            </div>
        </div>
    );
};

export default MediaPlayer;