'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TextAnalyzer() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<any>(null);

  const analyzeText = () => {
    if (!input.trim()) {
      setStats(null);
      return;
    }

    const text = input;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(para => para.trim().length > 0);

    // 字符统计
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;

    // 词频统计
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      const lowerWord = word.toLowerCase().replace(/[.,!?;:'"()]/g, '');
      if (lowerWord) {
        wordFreq[lowerWord] = (wordFreq[lowerWord] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // 情感分析（简单版）
    const positiveWords = ['好', '棒', '优秀', '喜欢', '爱', '开心', '快乐', '成功', '完美', 'great', 'good', 'love', 'happy', 'excellent', 'perfect'];
    const negativeWords = ['坏', '差', '讨厌', '恨', '难过', '悲伤', '失败', '糟糕', 'bad', 'hate', 'sad', 'fail', 'terrible'];

    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (positiveWords.some(pw => lowerWord.includes(pw))) {
        positiveCount++;
      }
      if (negativeWords.some(nw => lowerWord.includes(nw))) {
        negativeCount++;
      }
    });

    let sentiment = '中性';
    if (positiveCount > negativeCount * 2) {
      sentiment = '积极';
    } else if (negativeCount > positiveCount * 2) {
      sentiment = '消极';
    }

    setStats({
      charCount,
      charCountNoSpaces,
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordLength: words.length > 0 ? (charCountNoSpaces / words.length).toFixed(2) : 0,
      avgSentenceLength: sentences.length > 0 ? (words.length / sentences.length).toFixed(2) : 0,
      topWords,
      sentiment,
      positiveCount,
      negativeCount,
    });
  };

  const clearAll = () => {
    setInput('');
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
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
              📊 文本分析工具
            </h1>

            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                输入文本
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 bg-white/20 text-white p-4 rounded-xl border-2 border-white/30 focus:border-pink-400 focus:outline-none resize-none"
                placeholder="在这里输入文本..."
              />
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={analyzeText}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                分析文本
              </button>

              <button
                onClick={clearAll}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 px-8 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                清空
              </button>
            </div>

            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/20 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">基本统计</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">字符数: <span className="text-white font-bold">{stats.charCount}</span></p>
                    <p className="text-gray-300">字符数（不含空格）: <span className="text-white font-bold">{stats.charCountNoSpaces}</span></p>
                    <p className="text-gray-300">单词数: <span className="text-white font-bold">{stats.wordCount}</span></p>
                    <p className="text-gray-300">句子数: <span className="text-white font-bold">{stats.sentenceCount}</span></p>
                    <p className="text-gray-300">段落数: <span className="text-white font-bold">{stats.paragraphCount}</span></p>
                  </div>
                </div>

                <div className="bg-white/20 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">平均统计</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">平均单词长度: <span className="text-white font-bold">{stats.avgWordLength}</span></p>
                    <p className="text-gray-300">平均句子长度: <span className="text-white font-bold">{stats.avgSentenceLength}</span></p>
                  </div>
                </div>

                <div className="bg-white/20 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">情感分析</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">情感倾向: <span className="text-white font-bold">{stats.sentiment}</span></p>
                    <p className="text-gray-300">积极词汇: <span className="text-white font-bold">{stats.positiveCount}</span></p>
                    <p className="text-gray-300">消极词汇: <span className="text-white font-bold">{stats.negativeCount}</span></p>
                  </div>
                </div>

                <div className="bg-white/20 rounded-xl p-6 md:col-span-2 lg:col-span-2">
                  <h3 className="text-white font-bold mb-4">高频词汇（前10）</h3>
                  <div className="space-y-2">
                    {stats.topWords.map(([word, count]: [string, number], index: number) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-300">{index + 1}. {word}</span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
