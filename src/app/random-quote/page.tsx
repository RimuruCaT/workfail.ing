'use client';

import { useState } from 'react';
import Link from 'next/link';

const quotes = [
  { text: '失败是成功之母，但成功是失败的儿子', author: '匿名' },
  { text: '代码能跑就行，别问为什么', author: '程序员' },
  { text: '我写代码的时候，上帝都在笑', author: '匿名' },
  { text: '调试代码就像在黑暗中找一只黑猫', author: '匿名' },
  { text: '我的代码没有bug，只有特性', author: '程序员' },
  { text: '人生苦短，我用Python', author: 'Guido van Rossum' },
  { text: 'JavaScript是世界上最好的语言，也是最坏的', author: '匿名' },
  { text: '我从不写bug，我只是创造意外的功能', author: '程序员' },
  { text: '代码审查就是互相伤害', author: '匿名' },
  { text: '我的代码像诗一样优美，只是没人能读懂', author: '程序员' },
  { text: '加班是福报，996是福报中的福报', author: '匿名' },
  { text: '我写的代码连我自己都看不懂', author: '程序员' },
  { text: 'Git是世界上最伟大的发明，也是最可怕的', author: '匿名' },
  { text: '我的代码没有注释，因为注释是给弱者看的', author: '程序员' },
  { text: '我从不重构，因为重构就是承认自己错了', author: '匿名' },
  { text: '我的代码像艺术品，只是没人欣赏', author: '程序员' },
  { text: '我从不写测试，因为测试是浪费时间', author: '匿名' },
  { text: '我的代码没有bug，只有未发现的特性', author: '程序员' },
  { text: '我从不看文档，因为文档是给新手看的', author: '匿名' },
  { text: '我的代码像魔法，只是没人能理解', author: '程序员' },
];

export default function RandomQuote() {
  const [quote, setQuote] = useState(quotes[0]);

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-8 text-white hover:text-pink-300 transition-colors"
          >
            ← 返回首页
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              💬 随机名言生成器
            </h1>

            <div className="bg-white/20 rounded-2xl p-8 mb-8">
              <p className="text-2xl text-white mb-4 text-center leading-relaxed">
                "{quote.text}"
              </p>
              <p className="text-lg text-gray-300 text-right">
                — {quote.author}
              </p>
            </div>

            <button
              onClick={generateQuote}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              生成新名言
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                共有 {quotes.length} 条名言
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
