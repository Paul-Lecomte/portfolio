"use client";

import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { useState } from "react";

export default function Window({ title }: { title: string }) {
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(300);

    return (
        <Draggable>
            <div className="absolute top-20 left-20 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                <div className="flex justify-between items-center bg-gray-800 text-white p-2 cursor-move">
                    <span>{title}</span>
                    <button className="text-red-500 hover:text-red-700">×</button>
                </div>
                <ResizableBox
                    width={width}
                    height={height}
                    minConstraints={[200, 150]}
                    maxConstraints={[800, 600]}
                    onResizeStop={(e, data) => {
                        setWidth(data.size.width);
                        setHeight(data.size.height);
                    }}
                >
                    <div className="p-4 text-white">Content goes here...</div>
                </ResizableBox>
            </div>
        </Draggable>
    );
}