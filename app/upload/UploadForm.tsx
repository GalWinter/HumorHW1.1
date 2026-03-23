"use client";

import { useState } from "react";
import { generateCaptions, generatePresignedUrl, registerImageUrl } from "./actions";

type Caption = {
  id: string;
  content: string;
};

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload JPEG, PNG, WebP, or GIF.");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setCaptions([]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setCaptions([]);

    try {
      setStatus("Generating upload URL...");
      const presigned = await generatePresignedUrl(file.type);
      if (presigned.error || !presigned.presignedUrl || !presigned.cdnUrl) {
        throw new Error(presigned.error || "Failed generating upload URL");
      }

      setStatus("Uploading image...");
      const uploadResponse = await fetch(presigned.presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadResponse.ok) throw new Error("Failed to upload image");

      setStatus("Registering image...");
      const registered = await registerImageUrl(presigned.cdnUrl);
      if (registered.error || !registered.imageId) {
        throw new Error(registered.error || "Failed to register image");
      }

      setStatus("Generating captions...");
      const generated = await generateCaptions(registered.imageId);
      if (generated.error) throw new Error(generated.error);

      setCaptions(generated.captions || []);
      setStatus("Done!");
    } catch (e) {
      setStatus("");
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <label htmlFor="imageUpload" className="form-label">
          Select an image
        </label>
        <input
          type="file"
          id="imageUpload"
          className="form-input"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          disabled={loading}
        />
        <p className="form-hint">Supported: JPEG, PNG, WebP, GIF</p>
      </div>

      {preview && (
        <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
          <img src={preview} alt="Preview" className="image-preview" />
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="btn-accent"
      >
        {loading ? status : "Upload & Generate Captions"}
      </button>

      {error && (
        <div className="alert-error" style={{ marginTop: "0.75rem" }}>
          {error}
        </div>
      )}

      {captions.length > 0 && (
        <div style={{ marginTop: "1.4rem" }}>
          <h5 style={{ marginBottom: "0.75rem" }}>Generated Captions</h5>
          {captions.map((caption, index) => (
            <div key={caption.id || String(index)} className="caption-item">
              <p className="caption-text">&ldquo;{caption.content}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
