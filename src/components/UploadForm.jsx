import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const UploadForm = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ในที่นี้เราจะแค่แสดงข้อความว่าอัปโหลดสำเร็จ
    // ในการใช้งานจริง คุณจะต้องส่งไฟล์ไปยังเซิร์ฟเวอร์
    toast.success(`อัปโหลดไฟล์สำเร็จ ${files.length} ไฟล์`);
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file-upload">เลือกไฟล์ (รูปภาพ, วิดีโอ, หรือไฟล์อื่นๆ)</Label>
        <Input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*,audio/*,application/*"
          className="mt-1"
        />
      </div>
      {files.length > 0 && (
        <div>
          <p>ไฟล์ที่เลือก:</p>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <Button type="submit">อัปโหลด</Button>
    </form>
  );
};

export default UploadForm;