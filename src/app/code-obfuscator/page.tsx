'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CodeObfuscator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const obfuscateCode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    // 简单的代码混淆逻辑
    let obfuscated = input
      // 替换变量名
      .replace(/\b(const|let|var)\s+(\w+)/g, '$1 _0x' + Math.random().toString(36).substr(2, 8))
      // 替换函数名
      .replace(/\bfunction\s+(\w+)/g, 'function _0x' + Math.random().toString(36).substr(2, 8))
      // 添加随机注释
      .split('\n')
      .map(line => {
        if (line.trim() && Math.random() > 0.7) {
          return line + ' // ' + Math.random().toString(36).substr(2, 10);
        }
        return line;
      })
      .join('\n')
      // 添加空行
      .split('\n')
      .map(line => {
        if (line.trim() && Math.random() > 0.8) {
          return '\n' + line;
        }
        return line;
      })
      .join('\n');

    setOutput(obfuscated);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900">
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
              🔒 代码混淆器
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-bold mb-2">
                  输入代码
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-64 bg-white/20 text-white p-4 rounded-xl border-2 border-white/30 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm"
                  placeholder="在这里输入你的代码..."
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">
                  混淆结果
                </label>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-64 bg-white/20 text-white p-4 rounded-xl border-2 border-white/30 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm"
                  placeholder="混淆后的代码会显示在这里..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={obfuscateCode}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                混淆代码
              </button>

              <button
                onClick={clearAll}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                清空
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                ⚠️ 这只是一个简单的混淆器，不要用于生产环境
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
