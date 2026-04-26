import Link from 'next/link';

const tools = [
  {
    id: 'random-quote',
    name: '随机名言生成器',
    description: '生成各种奇怪的名言',
    icon: '💬',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'code-obfuscator',
    name: '代码混淆器',
    description: '把代码变得不可读',
    icon: '🔒',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ascii-art',
    name: 'ASCII艺术生成器',
    description: '文字转ASCII艺术',
    icon: '🎨',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'random-color',
    name: '随机颜色生成器',
    description: '生成随机颜色和调色板',
    icon: '🌈',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'text-analyzer',
    name: '文本分析工具',
    description: '统计字数、词频、情感分析',
    icon: '📊',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'time-calculator',
    name: '时间计算器',
    description: '各种时间相关的计算',
    icon: '⏰',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'image-processor',
    name: '图片处理工具',
    description: '压缩、裁剪、滤镜',
    icon: '🖼️',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'json-formatter',
    name: 'JSON格式化工具',
    description: 'JSON美化、压缩、验证',
    icon: '📝',
    color: 'from-cyan-500 to-blue-500',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
            workfail.ing
          </h1>
          <p className="text-2xl text-gray-300 mb-2">数字游乐场</p>
          <p className="text-lg text-gray-400">各种好玩的小工具，随时添加新的</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="group"
            >
              <div className={`bg-gradient-to-br ${tool.color} p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-gray-100 text-sm">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm">
            Made with ❤️ by OpenCaT | 随时添加新工具
          </p>
        </div>
      </div>
    </div>
  );
}
