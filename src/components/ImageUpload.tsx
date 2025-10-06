'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Link, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  type: 'club' | 'trainer' | 'direction';
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  type, 
  className = '', 
  disabled = false 
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  }, [disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.url);
      } else {
        alert(result.error || 'Ошибка загрузки файла');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    // Validate URL
    try {
      new URL(urlInput);
      onChange(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
    } catch {
      alert('Пожалуйста, введите корректный URL');
    }
  };

  const handleRemove = async () => {
    if (value && value.startsWith('/uploads/')) {
      try {
        await fetch(`/api/upload/image?url=${encodeURIComponent(value)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    onRemove?.();
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          {!disabled && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Загрузка...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  disabled={disabled}
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-blue-500" />
                  <span className="text-sm font-medium">Загрузить файл</span>
                </button>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                  disabled={disabled}
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <Link className="w-8 h-8 text-green-500" />
                  <span className="text-sm font-medium">По ссылке</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                Перетащите изображение сюда или выберите файл
              </p>
              <p className="text-xs text-gray-400">
                Поддерживаются: WebP, JPEG, JPG, PNG (до 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {showUrlInput && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Введите URL изображения"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/webp,image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
