import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Upload, Mic, File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CameraModal from './CameraModal';

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);
    handleUpload(selectedFiles);
  };

  const handleUpload = (filesToUpload) => {
    // Simulate upload process
    toast.success(`อัปโหลดไฟล์สำเร็จ ${filesToUpload.length} ไฟล์`);
    setFiles([]);
  };

  const handleUploadOption = (option) => {
    setIsOpen(false);
    switch (option) {
      case 'camera':
        setIsCameraModalOpen(true);
        break;
      case 'photo':
        fileInputRef.current.click();
        break;
      case 'audio':
        audioInputRef.current.click();
        break;
      case 'file':
        fileInputRef.current.click();
        break;
      default:
        break;
    }
  };

  const handleCameraCapture = (file) => {
    setFiles([file]);
    handleUpload([file]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">เลือกไฟล์ (รูปภาพ, วิดีโอ, หรือไฟล์อื่นๆ)</Label>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">อัปโหลดไฟล์แนบ</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>เลือกประเภทการอัปโหลด</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleUploadOption('camera')} className="flex flex-col items-center justify-center h-24">
                <Camera className="h-8 w-8 mb-2" />
                ถ่ายภาพหรือวิดีโอ
              </Button>
              <Button onClick={() => handleUploadOption('photo')} className="flex flex-col items-center justify-center h-24">
                <Upload className="h-8 w-8 mb-2" />
                อัปโหลดภาพหรือวิดีโอ
              </Button>
              <Button onClick={() => handleUploadOption('audio')} className="flex flex-col items-center justify-center h-24">
                <Mic className="h-8 w-8 mb-2" />
                อัปโหลดไฟล์เสียง
              </Button>
              <Button onClick={() => handleUploadOption('file')} className="flex flex-col items-center justify-center h-24">
                <File className="h-8 w-8 mb-2" />
                อัปโหลดไฟล์อื่นๆ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*,audio/*,application/*"
          ref={fileInputRef}
          className="hidden"
        />
        <Input
          type="file"
          accept="audio/*"
          className="hidden"
          ref={audioInputRef}
          onChange={handleFileChange}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold">ไฟล์ที่เลือก:</p>
          <ul className="list-disc pl-5 mt-2 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <li key={index} className="text-sm">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <CameraModal 
        isOpen={isCameraModalOpen} 
        setIsOpen={setIsCameraModalOpen} 
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

export default UploadForm;
