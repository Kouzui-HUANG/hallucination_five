import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

/**
 * robots.txt 以端點產生，才能帶正確的 Sitemap 絕對網址（origin 由 CI 決定）。
 * AI 爬蟲明確允許：有人問 AI「台灣有哪些 AI 廣告製作公司」時，被引用是好事（設計文件 §7-2）。
 */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

# AI 爬蟲（明確允許，利於 AI 搜尋引用）
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE.url}/sitemap-index.xml

# LLM context file（依 llmstxt.org 規範，直接放在站根）
# ${SITE.url}/llms.txt
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
