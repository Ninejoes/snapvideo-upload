import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Download } from "lucide-react";

const CameraModal = ({ isOpen, setIsOpen, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      if (stream) {
        stopCamera();
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isFrontCamera ? "user" : "environment" }
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
    }
  };

  const retakePhoto = () => {
    setIsCaptured(false);
    startCamera();
  };

  const downloadPhoto = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'captured_photo.jpg';
      link.click();
    }
  };

  const confirmPhoto = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
        onCapture(file);
        setIsOpen(false);
      }, 'image/jpeg');
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    startCamera();
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setIsCaptured(false);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, isFrontCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ถ่ายภาพหรือวิดีโอ</DialogTitle>
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
                <Button onClick={capturePhoto}><Camera className="mr-2 h-4 w-4" /> ถ่ายภาพ</Button>
                <Button onClick={toggleCamera}><RefreshCw className="mr-2 h-4 w-4" /> สลับกล้อง</Button>
              </>
            ) : (
              <>
                <Button onClick={retakePhoto}>ถ่ายใหม่</Button>
                <Button onClick={confirmPhoto}>ยืนยัน</Button>
                <Button onClick={downloadPhoto}><Download className="mr-2 h-4 w-4" /> ดาวน์โหลด</Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraModal;
