import { useState } from "react";

const WebBrowser = ({ url, onClose }: any) => {
    return (
        <div className="w-full h-full bg-gray-800 p-4 rounded-lg">
            <iframe
                src={url}
                className="w-full h-full rounded-lg"
                title="Web Browser"
            />
            <button onClick={onClose} className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full">X</button>
        </div>
    );
};

export default WebBrowser;
