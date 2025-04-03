import React, { useState, useEffect } from 'react';

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
                    className={`text-xl ${networkStatus === "online" ? "text-green-500" : "text-red-500"}`}
                    onClick={toggleNetworkPopup}
                >
                    {networkStatus === "online" ? "📶" : "🚫"}
                </span>
                {showNetworkPopup && (
                    <div className="popup">
                        <p>Status: {networkStatus}</p>
                        <button onClick={() => alert('Network settings clicked')}>Network Settings</button>
                    </div>
                )}
            </div>

            {/* Volume Control */}
            <div className="relative">
                <button onClick={toggleVolumePopup} className="cursor-pointer">
                    {muted ? "🔇" : "🔊"}
                </button>
                {showVolumePopup && (
                    <div className="popup">
                        <p>Volume: {volume}%</p>
                        <button onClick={toggleMute} className="block mb-2">
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
                <span className="text-xl" onClick={toggleBatteryPopup}>
                    {batteryLevel >= 20 ? "⚡" : "🔋"} {batteryLevel}%
                </span>
                {showBatteryPopup && (
                    <div className="popup">
                        <p>Battery: {batteryLevel}%</p>
                        <button onClick={() => alert('Battery settings clicked')}>Battery Settings</button>
                    </div>
                )}
            </div>

            {/* Toggle Time/Date */}
            <div className="relative">
                <span onClick={toggleTimePopup} className="cursor-pointer text-lg hover:text-gray-400">
                    {showDate ? new Date().toLocaleDateString() : time}
                </span>
                {showTimePopup && (
                    <div className="popup">
                        <p>{showDate ? new Date().toLocaleDateString() : time}</p>
                        <button onClick={toggleTimeDate}>Toggle Date/Time</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemTray;