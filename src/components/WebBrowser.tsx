import { useState } from "react";

const WebBrowser = ({ url, onClose }: any) => {
    return (
        <div className="w-full h-full bg-gray-800 p-4 rounded-lg">
            <iframe
                src={url}
                className="w-full h-full rounded-lg"
                title="Web Browser"
            />
        </div>
    );
};

export default WebBrowser;
