"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadCSSPage() {
    const [file, setFile] = useState<File | null> (null);
    const router = useRouter();
    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg w-full max-w-lg h-64 flex flex-col items-center justify-center bg-white">
        <input
          type="file"
          accept=".css"
          onChange={handleFileChange}
          className="hidden"
          id="html-upload"
        />
        <label htmlFor="html-upload" className="cursor-pointer text-gray-700">
          Drop files here or <span className="text-blue-600 underline">browse files</span>
        </label>
        {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border border-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => router.push("/")} // handle saving logic here
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Upload
        </button>
      </div>
    </div>
    )
}