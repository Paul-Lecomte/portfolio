import {useRef, useState} from "react";

const MediaPlayer = ({ mediaUrl, onClose }: any) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const mediaRef = useRef<HTMLMediaElement | null>(null);

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

    return (
        <div className="w-full h-full bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center">
            <video
                ref={mediaRef}
                src={mediaUrl}
                controls
                className="rounded-lg w-full h-full"
                onClick={handlePlayPause}
            />
            <div className="flex justify-between w-full mt-2">
                <button onClick={handlePlayPause} className="bg-blue-500 p-2 rounded-md text-white">
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={onClose} className="bg-red-500 p-2 rounded-md text-white">
                    Close
                </button>
            </div>
        </div>
    );
};

export default MediaPlayer;
