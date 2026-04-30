export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  slug: string;
  tags: string[];
}

export interface AgentToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
}
