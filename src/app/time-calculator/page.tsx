'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TimeCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const calculateTime = () => {
    if (!input.trim()) {
      setResult('');
      return;
    }

    const now = new Date();
    const inputDate = new Date(input);

    if (isNaN(inputDate.getTime())) {
      setResult('无效的日期格式');
      return;
    }

    const diff = inputDate.getTime() - now.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);

    let resultText = '';

    if (diff > 0) {
      resultText = `距离 ${inputDate.toLocaleString('zh-CN')} 还有：\n`;
      resultText += `${diffDays} 天 ${diffHours} 小时 ${diffMinutes} 分钟 ${diffSeconds} 秒`;
    } else if (diff < 0) {
      resultText = `距离 ${inputDate.toLocaleString('zh-CN')} 已经过去：\n`;
      resultText += `${Math.abs(diffDays)} 天 ${Math.abs(diffHours)} 小时 ${Math.abs(diffMinutes)} 分钟 ${Math.abs(diffSeconds)} 秒`;
    } else {
      resultText = `就是现在！`;
    }

    setResult(resultText);
  };

  const getCurrentTime = () => {
    const now = new Date();
    setInput(now.toISOString().slice(0, 16));
  };

  const clearAll = () => {
    setInput('');
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-8 text-white hover:text-purple-300 transition-colors"
          >
            ← 返回首页
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              ⏰ 时间计算器
            </h1>

            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                选择日期和时间
              </label>
              <input
                type="datetime-local"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/20 text-white p-4 rounded-xl border-2 border-white/30 focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={calculateTime}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 px-8 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                计算时间差
              </button>

              <button
                onClick={getCurrentTime}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-8 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                当前时间
              </button>

              <button
                onClick={clearAll}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                清空
              </button>
            </div>

            {result && (
              <div className="bg-white/20 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">计算结果</h3>
                <pre className="text-white whitespace-pre-wrap font-mono">
                  {result}
                </pre>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                当前时间: {new Date().toLocaleString('zh-CN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
