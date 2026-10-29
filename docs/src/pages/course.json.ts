// 全コース共通ポータル（neuve.com/learn/）のマイページが読むレッスン一覧
// レッスン = 学習進捗ページと同じ章の一覧（章末クイズの完了で「完了」になる）
import type { APIRoute } from 'astro';
import { parts } from '../components/Progress';

const BASE = '/how-to-use-github/';

export const GET: APIRoute = () => {
    const lessons = parts.flatMap((part) =>
        part.chapters.map((chapter) => ({
            id: chapter.id,
            title: `${part.label}｜${chapter.title}`,
            url: chapter.link.replace(BASE, ''),
        }))
    );
    return new Response(JSON.stringify({ id: 'github', title: 'GitHub 完全ガイド', lessons }, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
};
