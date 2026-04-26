'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ImageProcessor() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setProcessedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filter}`;
        ctx.drawImage(img, 0, 0);

        const processedDataUrl = canvas.toDataURL('image/png');
        setProcessedImage(processedDataUrl);
      }
    };

    img.src = image;
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    link.click();
  };

  const resetFilters = () => {
    setFilter('none');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    if (image) {
      setProcessedImage(image);
    }
  };

  const clearAll = () => {
    setImage(null);
    setProcessedImage(null);
    setFilter('none');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-900 to-red-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-8 text-white hover:text-pink-300 transition-colors"
          >
            ← 返回首页
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              🖼️ 图片处理工具
            </h1>

            <div className="mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-8 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center cursor-pointer"
              >
                上传图片
              </label>
            </div>

            {image && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-bold mb-4">原始图片</h3>
                    <div className="bg-black/50 rounded-xl p-4">
                      <img
                        src={image}
                        alt="Original"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-4">处理后的图片</h3>
                    <div className="bg-black/50 rounded-xl p-4">
                      <img
                        src={processedImage || image}
                        alt="Processed"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-bold mb-4">滤镜设置</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-white mb-2">滤镜效果</label>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-white/20 text-white p-3 rounded-lg border-2 border-white/30 focus:border-pink-400 focus:outline-none"
                      >
                        <option value="none">无</option>
                        <option value="grayscale(100%)">黑白</option>
                        <option value="sepia(100%)">复古</option>
                        <option value="blur(5px)">模糊</option>
                        <option value="invert(100%)">反色</option>
                        <option value="hue-rotate(90deg)">色相旋转</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white mb-2">亮度: {brightness}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">对比度: {contrast}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">饱和度: {saturation}%</label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={applyFilters}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      应用滤镜
                    </button>

                    <button
                      onClick={resetFilters}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      重置滤镜
                    </button>

                    <button
                      onClick={downloadImage}
                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      下载图片
                    </button>
                  </div>
                </div>

                <button
                  onClick={clearAll}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  清空所有
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
