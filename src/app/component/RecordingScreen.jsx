import React, { useRef, useState } from 'react'
import { BsRecordCircle } from 'react-icons/bs';

const RecordingScreen = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordedChunks = useRef([]);
    const timerRef = useRef(null);
    const screenRecorder = useRef(null);



    const startScreenRecording = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);

            recordedChunks.current = [];

            const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
            screenRecorder.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'screen-recording.webm';
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);

                recordedChunks.current = [];
            };

            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Timer starts
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

            // Stop recording when screen sharing stops
            screenStream.getVideoTracks()[0].onended = () => {
                stopScreenRecording();
            };
        } catch (err) {
            console.error("Error accessing screen or mic:", err);
        }
    };

    const stopScreenRecording = () => {
        if (screenRecorder.current) {
            screenRecorder.current.stop();
            screenRecorder.current = null;
        }

        setIsRecording(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const toggleScreenRecording = () => {
        if (isRecording) {
            stopScreenRecording();
        } else {
            startScreenRecording();
        }
    };




    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${mins}:${secs}`;
    };


    return (
        <div

            onClick={toggleScreenRecording}
            style={{
                color: isRecording ? "red" : "white",
                position: "relative",
            }}
        >
            <BsRecordCircle />
            {isRecording && (
                <span
                    style={{
                        position: "absolute",
                        top: "-20px",
                        fontSize: "12px",
                        color: "white",
                    }}
                >
                    {formatTime(recordingTime)}
                </span>
            )}
        </div>

    )
}

export default RecordingScreen