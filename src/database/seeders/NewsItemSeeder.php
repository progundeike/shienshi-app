<?php

namespace Database\Seeders;

use App\Models\NewsItem;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class NewsItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NewsItem::updateOrCreate(
            ['id' => 1],
            [
                'title' => 'β版公開のお知らせ',
                'content' => '支援士対策室のβ版を公開しました。β版のため、今後仕様変更や機能改善を行う場合があります。不具合等がありましたら、お問い合わせフォームよりご連絡いただけると幸いです。',
                'published_at' => Carbon::create(2026, 5, 1, 10, 0, 0, 'Asia/Tokyo'),
            ]
        );
    }
}
