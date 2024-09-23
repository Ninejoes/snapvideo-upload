import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Download, Video } from "lucide-react";

const CameraModal = ({ isOpen, setIsOpen, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [stream, setStream] = useState(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  const startCamera = async () => {
    try {
      if (stream) {
        stopCamera();
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isFrontCamera ? "user" : "environment" },
        audio: isVideoMode
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      setIsCaptured(true);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      const blob = dataURLtoBlob(dataUrl);
      const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
      onCapture(file);
    }
  };

  const startRecording = () => {
    setRecordedChunks([]);
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const file = new File([blob], "recorded_video.webm", { type: "video/webm" });
      onCapture(file);
      setIsCaptured(true);
    };
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => prev.concat(event.data));
    }
  };

  const retakeMedia = () => {
    setIsCaptured(false);
    setRecordedChunks([]);
    startCamera();
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    startCamera();
  };

  const toggleVideoMode = () => {
    setIsVideoMode(!isVideoMode);
    setIsCaptured(false);
    setRecordedChunks([]);
    startCamera();
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setIsCaptured(false);
      setRecordedChunks([]);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, isFrontCamera, isVideoMode]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isVideoMode ? 'บันทึกวิดีโอ' : 'ถ่ายภาพ'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          {!isCaptured ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
          ) : (
            <canvas ref={canvasRef} width={640} height={480} className="w-full h-auto" />
          )}
          <div className="flex justify-center space-x-4 mt-4">
            {!isCaptured ? (
              <>
                {isVideoMode ? (
                  recordedChunks.length === 0 ? (
                    <Button onClick={startRecording}><Video className="mr-2 h-4 w-4" /> เริ่มบันทึก</Button>
                  ) : (
                    <Button onClick={stopRecording}><Video className="mr-2 h-4 w-4" /> หยุดบันทึก</Button>
                  )
                ) : (
                  <Button onClick={capturePhoto}><Camera className="mr-2 h-4 w-4" /> ถ่ายภาพ</Button>
                )}
                <Button onClick={toggleCamera}><RefreshCw className="mr-2 h-4 w-4" /> สลับกล้อง</Button>
                <Button onClick={toggleVideoMode}>
                  {isVideoMode ? <Camera className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
                  {isVideoMode ? 'โหมดภาพ' : 'โหมดวิดีโอ'}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={retakeMedia}>ถ่ายใหม่</Button>
                <Button onClick={() => setIsOpen(false)}>ยืนยัน</Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraModal;
