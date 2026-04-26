'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RandomColor() {
  const [colors, setColors] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generatePalette = () => {
    const newColors = [];
    for (let i = 0; i < 5; i++) {
      newColors.push(generateRandomColor());
    }
    setColors(newColors);
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-8 text-white hover:text-orange-300 transition-colors"
          >
            ← 返回首页
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              🌈 随机颜色生成器
            </h1>

            <button
              onClick={generatePalette}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg mb-8"
            >
              生成调色板
            </button>

            {colors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => copyToClipboard(color)}
                  >
                    <div
                      className="w-full h-32 rounded-xl shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-white font-mono text-sm">{color}</p>
                      {copied === color && (
                        <p className="text-green-400 text-xs mt-1">已复制!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {colors.length > 0 && (
              <div className="bg-white/20 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">调色板预览</h3>
                <div
                  className="w-full h-24 rounded-lg shadow-lg"
                  style={{
                    background: `linear-gradient(to right, ${colors.join(', ')})`,
                  }}
                />
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                点击颜色可以复制到剪贴板
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
