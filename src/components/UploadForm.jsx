import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera } from "lucide-react";

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`อัปโหลดไฟล์สำเร็จ ${files.length} ไฟล์`);
    setFiles([]);
  };

  const handleCameraClick = () => {
    cameraInputRef.current.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">เลือกไฟล์ (รูปภาพ, วิดีโอ, หรือไฟล์อื่นๆ)</Label>
        <div className="flex space-x-2">
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*,audio/*,application/*"
            ref={fileInputRef}
            className="flex-grow"
          />
          <Button type="button" onClick={handleCameraClick} className="flex-shrink-0">
            <Camera className="h-4 w-4 mr-2" />
            ถ่ายภาพ
          </Button>
        </div>
        <Input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          ref={cameraInputRef}
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
      <Button type="submit" className="w-full mt-4">อัปโหลด</Button>
    </form>
  );
};

export default UploadForm;
