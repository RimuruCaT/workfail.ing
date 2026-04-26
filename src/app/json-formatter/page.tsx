'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError('无效的JSON格式: ' + (e as Error).message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError('无效的JSON格式: ' + (e as Error).message);
      setOutput('');
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setError('请输入JSON');
      return;
    }

    try {
      JSON.parse(input);
      setError('');
      alert('JSON格式正确！');
    } catch (e) {
      setError('无效的JSON格式: ' + (e as Error).message);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      alert('已复制到剪贴板！');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-8 text-white hover:text-cyan-300 transition-colors"
          >
            ← 返回首页
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              📝 JSON格式化工具
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-bold mb-2">
                  输入JSON
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-64 bg-white/20 text-white p-4 rounded-xl border-2 border-white/30 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm"
                  placeholder="在这里输入JSON..."
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">
                  输出结果
                </label>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-64 bg-white/20 text-white p-4 rounded-xl border-2 border-white/30 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm"
                  placeholder="格式化后的JSON会显示在这里..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-6">
                <p className="text-red-300 font-bold">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={formatJson}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                美化
              </button>

              <button
                onClick={minifyJson}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                压缩
              </button>

              <button
                onClick={validateJson}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                验证
              </button>

              <button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                复制
              </button>
            </div>

            <button
              onClick={clearAll}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              清空
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                支持JSON美化、压缩、验证
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
