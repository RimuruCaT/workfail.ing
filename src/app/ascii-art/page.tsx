'use client';

import { useState } from 'react';
import Link from 'next/link';

const asciiArt: Record<string, string[]> = {
  'A': [
    '  /\\  ',
    ' /  \\ ',
    '/ /\\ \\',
    '\\ \\/ /',
    ' \\  / ',
    '  \\/  '
  ],
  'B': [
    ' ____ ',
    '| __ )',
    '|  _ \\',
    '| |_) |',
    '|____/',
  ],
  'C': [
    '  ___ ',
    ' / __|',
    '| (__ ',
    ' \\___|',
  ],
  'D': [
    ' ____ ',
    '|  _ \\',
    '| | | |',
    '| |_| |',
    '|____/',
  ],
  'E': [
    ' ____ ',
    '| ___|',
    '|___ \\',
    ' ___) |',
    '|____/',
  ],
  'F': [
    ' ____ ',
    '| ___|',
    '|___ \\',
    ' ___) |',
    '|____/',
  ],
  'G': [
    '  ____ ',
    ' / __ \\',
    '| |  | |',
    '| |__| |',
    ' \\____/',
  ],
  'H': [
    ' _   _ ',
    '| | | |',
    '| |_| |',
    '|  _  |',
    '|_| |_|',
  ],
  'I': [
    ' ___ ',
    '|_ _|',
    ' | | ',
    ' | | ',
    '|___|',
  ],
  'J': [
    '   ___',
    '  / _ |',
    ' | (_| |',
    '  \\__,_|',
  ],
  'K': [
    ' _  __',
    '| |/ /',
    "| ' < ",
    '| . \\ ',
    '|_|\\_\\',
  ],
  'L': [
    ' _     ',
    '| |    ',
    '| |    ',
    '| |___ ',
    '|_____|',
  ],
  'M': [
    ' __  __ ',
    '|  \\/  |',
    '| |\\/| |',
    '| |  | |',
    '|_|  |_|',
  ],
  'N': [
    ' _   _ ',
    '| \\ | |',
    '|  \\| |',
    '| |\\  |',
    '|_| \\_|',
  ],
  'O': [
    '  ____ ',
    ' / __ \\',
    '| |  | |',
    '| |__| |',
    ' \\____/',
  ],
  'P': [
    ' ____ ',
    '| __ )',
    '|  _ \\',
    '| |_) |',
    '|____/',
  ],
  'Q': [
    '  ____ ',
    ' / __ \\',
    '| |  | |',
    '| |__| |',
    ' \\___/ \\',
  ],
  'R': [
    ' ____ ',
    '| __ )',
    '|  _ \\',
    '| |_) |',
    '|____/',
  ],
  'S': [
    ' ____ ',
    '| ___|',
    '|___ \\',
    ' ___) |',
    '|____/',
  ],
  'T': [
    ' _____ ',
    '|_   _|',
    '  | |  ',
    '  | |  ',
    '  |_|  ',
  ],
  'U': [
    ' _   _ ',
    '| | | |',
    '| | | |',
    '| |_| |',
    ' \\___/ ',
  ],
  'V': [
    '__   __',
    '\\ \\ / /',
    ' \\ V / ',
    '  | |  ',
    '  |_|  ',
  ],
  'W': [
    ' __          __',
    '\\ \\        / /',
    ' \\ \\  /\\  / / ',
    '  \\ \\/  \\/ /  ',
    '   \\  /\\  /   ',
    '    \\/  \\/    ',
  ],
  'X': [
    '__  __',
    '\\ \\/ /',
    ' >  < ',
    '/ /\\ \\',
    '/_/  \\_\\',
  ],
  'Y': [
    '__   __',
    '\\ \\ / /',
    ' \\ V / ',
    '  | |  ',
    '  |_|  ',
  ],
  'Z': [
    ' ____ ',
    '|___ \\',
    '  __) |',
    ' / __/ ',
    '|_____|',
  ],
  ' ': [
    '      ',
    '      ',
    '      ',
    '      ',
    '      ',
  ],
};

export default function AsciiArt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generateAscii = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const text = input.toUpperCase();
    let result = '';

    for (let row = 0; row < 6; row++) {
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charArt = asciiArt[char] || asciiArt[' '];
        result += charArt[row] + ' ';
      }
      result += '\n';
    }

    setOutput(result);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-8 text-white hover:text-teal-300 transition-colors"
          >
            ← 返回首页
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              🎨 ASCII艺术生成器
            </h1>

            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                输入文字
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/20 text-white p-4 rounded-xl border-2 border-white/30 focus:border-teal-400 focus:outline-none font-mono text-lg"
                placeholder="在这里输入文字..."
                maxLength={10}
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                ASCII艺术
              </label>
              <div className="bg-black/50 p-6 rounded-xl min-h-[200px]">
                <pre className="text-green-400 font-mono text-sm whitespace-pre">
                  {output || 'ASCII艺术会显示在这里...'}
                </pre>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateAscii}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                生成ASCII艺术
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
                最多支持10个字符
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
