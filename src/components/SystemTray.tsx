import React, { useState, useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute, FaWifi, FaBatteryFull, FaBatteryEmpty, FaRegClock, FaCalendarAlt } from 'react-icons/fa';

const SystemTray = () => {
    const [volume, setVolume] = useState(50);
    const [muted, setMuted] = useState(false);
    const [networkStatus, setNetworkStatus] = useState("online");
    const [batteryLevel, setBatteryLevel] = useState(100);
    const [time, setTime] = useState("");
    const [showDate, setShowDate] = useState(false);
    const [showVolumePopup, setShowVolumePopup] = useState(false);
    const [showNetworkPopup, setShowNetworkPopup] = useState(false);
    const [showBatteryPopup, setShowBatteryPopup] = useState(false);
    const [showTimePopup, setShowTimePopup] = useState(false);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        const handleNetworkChange = () => {
            setNetworkStatus(navigator.onLine ? "online" : "offline");
        };
        window.addEventListener("online", handleNetworkChange);
        window.addEventListener("offline", handleNetworkChange);

        if (typeof navigator !== 'undefined' && navigator.getBattery) {
            const updateBatteryStatus = async () => {
                const battery = await navigator.getBattery();
                setBatteryLevel(Math.round(battery.level * 100));
            };
            updateBatteryStatus();
        }

        return () => {
            window.removeEventListener("online", handleNetworkChange);
            window.removeEventListener("offline", handleNetworkChange);
            clearInterval(timeInterval);
        };
    }, []);

    const handleVolumeChange = (e) => setVolume(e.target.value);
    const toggleMute = () => setMuted(!muted);
    const toggleTimeDate = () => setShowDate(!showDate);
    const toggleVolumePopup = () => setShowVolumePopup(!showVolumePopup);
    const toggleNetworkPopup = () => setShowNetworkPopup(!showNetworkPopup);
    const toggleBatteryPopup = () => setShowBatteryPopup(!showBatteryPopup);
    const toggleTimePopup = () => setShowTimePopup(!showTimePopup);

    return (
        <div className="flex items-center space-x-6 text-white">
            {/* Network Status */}
            <div className="relative">
                <span
                    onClick={toggleNetworkPopup}
                    className={'cursor-pointer p-3 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all'}
                >
                    {networkStatus === "online" ? <FaWifi size={24} /> : <FaWifi size={24} />}
                </span>
                {showNetworkPopup && (
                    <div className="popup absolute bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg text-white">
                        <p>Status: {networkStatus}</p>
                        <button onClick={() => alert('Network settings clicked')} className="text-blue-500 hover:underline">Network Settings</button>
                    </div>
                )}
            </div>

            {/* Volume Control */}
            <div className="relative">
                <button onClick={toggleVolumePopup} className="cursor-pointer p-3 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all">
                    {muted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
                </button>
                {showVolumePopup && (
                    <div className="popup absolute bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg text-white">
                        <p>Volume: {volume}%</p>
                        <button onClick={toggleMute} className="block mb-2 text-blue-500 hover:underline">
                            {muted ? "Unmute" : "Mute"}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={muted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-full"
                            disabled={muted}
                        />
                    </div>
                )}
            </div>

            {/* Battery Status */}
            <div className="relative">
                <span onClick={toggleBatteryPopup} className="cursor-pointer p-3 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all">
                    {batteryLevel >= 20 ? <FaBatteryFull size={24} /> : <FaBatteryEmpty size={24} />}
                </span>
                {showBatteryPopup && (
                    <div className="popup absolute bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg text-white">
                        <p>Battery: {batteryLevel}%</p>
                        <button onClick={() => alert('Battery settings clicked')} className="text-blue-500 hover:underline">Battery Settings</button>
                    </div>
                )}
            </div>

            {/* Toggle Time/Date */}
            <div className="relative">
                <span onClick={toggleTimePopup} className="cursor-pointer text-lg p-3 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all">
                    {showDate ? <FaCalendarAlt size={24} /> : <FaRegClock size={24} />}
                </span>
                {showTimePopup && (
                    <div className="popup absolute bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg text-white">
                        <p>{showDate ? new Date().toLocaleDateString() : time}</p>
                        <button onClick={toggleTimeDate} className="text-blue-500 hover:underline">Toggle Date/Time</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemTray;