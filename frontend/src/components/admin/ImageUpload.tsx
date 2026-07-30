"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/upload";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, multiple = false, label = "Images", folder }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, folder);
        urls.push(url);
      }
      onChange(multiple ? [...value, ...urls] : [urls[0]]);
    } catch {
      alert("Upload failed. Check backend is running.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url + i} className="relative w-24 h-24 rounded-lg overflow-hidden border group">
            <Image src={url} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          <span className="text-xs mt-1">{uploading ? "..." : "Upload"}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*,video/*" multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <p className="text-xs text-muted-foreground">Or paste URL below</p>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (urlInput.trim()) {
                onChange(multiple ? [...value, urlInput.trim()] : [urlInput.trim()]);
                setUrlInput("");
              }
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => {
          if (urlInput.trim()) {
            onChange(multiple ? [...value, urlInput.trim()] : [urlInput.trim()]);
            setUrlInput("");
          }
        }}>
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function SingleImageUpload({ value, onChange, label = "Image", folder }: SingleImageUploadProps) {
  return (
    <ImageUpload
      value={value ? [value] : []}
      onChange={(urls) => onChange(urls[0] || "")}
      multiple={false}
      label={label}
      folder={folder}
    />
  );
}
