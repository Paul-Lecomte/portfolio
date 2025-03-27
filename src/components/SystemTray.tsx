import React, { useState, useEffect } from 'react';

const SystemTray = () => {
    // State for controlling volume, muted status, network status, and battery level
    const [volume, setVolume] = useState(50); // Volume control (0-100)
    const [muted, setMuted] = useState(false); // Mute toggle
    const [networkStatus, setNetworkStatus] = useState("online"); // Network status (online/offline)
    const [batteryLevel, setBatteryLevel] = useState(100); // Battery level percentage
    const [time, setTime] = useState(""); // Time for the system tray (to be updated every second)
    const [showDate, setShowDate] = useState(false); // Toggle between showing date or time
    const [showVolumePopup, setShowVolumePopup] = useState(false);
    const [showNetworkPopup, setShowNetworkPopup] = useState(false);
    const [showBatteryPopup, setShowBatteryPopup] = useState(false);
    const [showTimePopup, setShowTimePopup] = useState(false);

    // Set up effect to update time, battery status, and network changes
    useEffect(() => {
        // Update time every second
        const timeInterval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        // Network status change handler
        const handleNetworkChange = () => {
            setNetworkStatus(navigator.onLine ? "online" : "offline");
        };
        window.addEventListener("online", handleNetworkChange);
        window.addEventListener("offline", handleNetworkChange);

        // Battery status update (only in the client-side environment)
        if (typeof navigator !== 'undefined' && navigator.getBattery) {
            const updateBatteryStatus = async () => {
                const battery = await navigator.getBattery();
                setBatteryLevel(Math.round(battery.level * 100));
            };
            updateBatteryStatus();
        }

        // Cleanup on unmount
        return () => {
            window.removeEventListener("online", handleNetworkChange);
            window.removeEventListener("offline", handleNetworkChange);
            clearInterval(timeInterval);
        };
    }, []);

    // Handle volume slider change
    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
    };

    // Toggle between showing time or date
    const toggleTimeDate = () => {
        setShowDate(!showDate);
    };

    // Toggle popups
    const toggleVolumePopup = () => setShowVolumePopup(!showVolumePopup);
    const toggleNetworkPopup = () => setShowNetworkPopup(!showNetworkPopup);
    const toggleBatteryPopup = () => setShowBatteryPopup(!showBatteryPopup);
    const toggleTimePopup = () => setShowTimePopup(!showTimePopup);

    // Toggle mute inside the popup
    const toggleMute = () => {
        setMuted(!muted);
        if (!muted) setVolume(50); // Restore volume when unmuted
    };

    return (
        <div className="flex items-center space-x-4 text-white">
            {/* Network Status */}
            <div className="relative">
                <span
                    className={`text-xl ${networkStatus === "online" ? "text-green-500" : "text-red-500"}`}
                    onClick={toggleNetworkPopup}
                >
                    {networkStatus === "online" ? "📶" : "🚫"}
                </span>
                {showNetworkPopup && (
                    <div className="absolute top-[-130px] left-0 bg-gray-800 p-4 text-white rounded shadow-lg z-50 transition-transform">
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
                    <div className="absolute top-[-130px] left-0 bg-gray-800 p-4 text-white rounded shadow-lg z-50 transition-transform">
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
                            disabled={muted} // Disable the slider if muted
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
                    <div className="absolute top-[-130px] left-16 bg-gray-800 p-4 text-white rounded shadow-lg z-50 transition-transform">
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
                    <div className="absolute top-[-130px] left-24 bg-gray-800 p-4 text-white rounded shadow-lg z-50 transition-transform">
                        <p>{showDate ? new Date().toLocaleDateString() : time}</p>
                        <button onClick={toggleTimeDate}>Toggle Date/Time</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemTray;