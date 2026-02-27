// components/FileUploader.tsx
import React, { ChangeEvent } from 'react';

type Props = {
  onROMUpload: (file: File) => void;
  onPatchUpload: (files: File[]) => void;
};

export default function FileUploader({ onROMUpload, onPatchUpload }: Props) {
  const handleROMInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onROMUpload(file);
  };

  const handlePatchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onPatchUpload(files);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <label className="block">
        Upload ROM (.gb):
        <input type="file" accept=".gb" onChange={handleROMInput} />
      </label>

      <label className="block">
        Upload IPS Patches (.zip or .ips):
        <input
          type="file"
          accept=".zip,.ips"
          multiple
          onChange={handlePatchInput}
        />
      </label>
    </div>
  );
}
