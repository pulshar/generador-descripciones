import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, AlertCircle } from 'lucide-react';
import { DEFAULT_IMAGE_URL } from '../constants';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (img: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingDefault, setLoadingDefault] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    
    // Validación de tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError("El archivo debe ser una imagen (JPG, PNG, WebP).");
      return;
    }

    // Validación de tamaño (ej: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande (máx 5MB).");
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulamos un tiempo de carga para feedback visual
      setTimeout(() => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
        setIsProcessing(false);
      }, 800);
    };
    reader.onerror = () => {
      setError("Error al leer el archivo. Inténtalo de nuevo.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const loadDefaultImage = async () => {
    setLoadingDefault(true);
    setError(null);
    try {
        const response = await fetch(DEFAULT_IMAGE_URL, { mode: 'cors' });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                onImageChange(reader.result as string);
            }
            setLoadingDefault(false);
        };
        reader.readAsDataURL(blob);
    } catch (e) {
        console.error("Failed to load default image", e);
        setError("No se pudo cargar la imagen de muestra.");
        setLoadingDefault(false);
    }
  };

  if (isProcessing || loadingDefault) {
     return (
        <div className="w-full h-80 rounded-xl border border-gray-100 bg-gray-50 flex flex-col items-center justify-center gap-4 animate-pulse">
            <Loader2 size={40} className="animate-spin text-[#0A221C]" />
            <p className="text-lg font-medium text-gray-600">
                {loadingDefault ? "Cargando muestra..." : "Subiendo imagen..."}
            </p>
        </div>
     );
  }

  if (image) {
    return (
      <div className="relative group w-full h-80 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white">
        <img src={image} alt="Product" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={() => onImageChange(null)}
            className="cursor-pointer bg-white/80 text-red-600 px-6 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-white transition-all shadow-lg text-base"
          >
            <X size={20} /> Cambiar Imagen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative w-full h-80 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center 
        ${
          isDragging
            ? "border-[#D1F083] bg-[#faffeb] scale-[1.01]"
            : error
            ? "border-red-200 bg-red-50/30"
            : "border-gray-200 bg-white hover:border-[#D1F083]/50 hover:bg-gray-50"
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files && processFile(e.target.files[0])}
      />

      {error ? (
        <div className="flex flex-col items-center gap-3 text-red-500 mb-2 animate-fade-in">
          <AlertCircle size={32} />
          <p className="text-base font-medium px-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline hover:text-red-700 mt-1 font-semibold"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : (
        <>
          <div
            className={`
                w-16 h-16 rounded-2xl flex items-center justify-center transition-colors mb-2
                ${isDragging ? "bg-[#D1F083]" : "bg-gray-100"}
            `}
          >
            <UploadCloud
              size={32}
              className={isDragging ? "text-[#0A221C]" : "text-gray-400"}
            />
          </div>

          <h2 className="font-semibold text-[#0A221C] text-xl">
            Sube tu producto
          </h2>
          <p className="text-gray-500 text-base">
            Arrastra o haz clic para explorar
          </p>
        </>
      )}

      {!error && (
        <div className="flex flex-col items-center mt-4 w-full max-w-xs px-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer w-full px-6 py-3 bg-[#0A221C] text-white rounded-md text-sm font-semibold transition-all shadow-sm duration-200 hover:hover:bg-[#1a3a32] hover:ring-3 hover:ring-[#D1F083]"
          >
            Seleccionar imagen
          </button>

          <div className="flex items-center gap-3 w-full my-1 mt-5">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              o
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button
            onClick={loadDefaultImage}
            className="cursor-pointer w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#0A221C] hover:bg-white rounded-lg flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-gray-200"
          >
            <ImageIcon size={16} /> Usar imagen de muestra
          </button>
        </div>
      )}
    </div>
  );
};