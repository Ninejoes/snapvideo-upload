import UploadForm from '../components/UploadForm';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">อัปโหลดไฟล์</h1>
        <UploadForm />
      </div>
    </div>
  );
};

export default Index;
