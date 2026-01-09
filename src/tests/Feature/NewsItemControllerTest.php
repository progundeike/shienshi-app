<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\NewsItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Hash;

class NewsItemControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $normalUser;

    public function setUp(): void
    {
        parent::setUp();

        // テスト用管理者ユーザーを作成
        $this->adminUser = User::factory()->create([
            'username' => 'TestAdminUser',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // テスト用一般ユーザーを作成
        $this->normalUser = User::factory()->create([
            'username' => 'NewTestUser',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);

        // テスト用のお知らせを挿入
        NewsItem::insert([
            [
                'title' => 'おしらせ1',
                'content' => null,
                'published_at' => now(),
            ],
            [
                'title' => 'news_item2',
                'content' => 'This is news item content message for testing.',
                'published_at' => now(),
            ]
        ]);
    }

    #[Test]
    public function お知らせ一覧を取得できる(): void
    {
        $response = $this->getJson('/api/news');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json());
    }

    #[Test]
    public function 管理者がお知らせを追加できる(): void
    {
        $newsItem = [
            'title' => 'おしらせ',
            'content' => '本文',
            'published_at' => now(),
        ];

        $response = $this->actingAs($this->adminUser)->postJson('/api/admin/news', $newsItem);

        $response->assertStatus(201);
        $this->assertDatabaseHas('news_items', [
            'title' => 'おしらせ',
            'content' => '本文',
        ]);
    }

    #[Test]
    public function 管理者がお知らせを編集できる(): void
    {
        $target = NewsItem::query()->latest('id')->first();
        $editTarget = [
            'id' => $target->id,
            'title' => '変更したタイトル',
            'content' => '変更した本文',
            'published_at' => \Carbon\Carbon::parse($target->published_at)->format('Y-m-d H:i:s'),
        ];

        $response = $this->actingAs($this->adminUser)->postJson('/api/admin/news', $editTarget);
        $response->assertStatus(200);
        $this->assertDatabaseHas('news_items', [
            'id' => $target->id,
            'title' => '変更したタイトル',
            'content' => '変更した本文',
            'published_at' => \Carbon\Carbon::parse($target->published_at)->format('Y-m-d H:i:s'),
        ]);
    }

    #[Test]
    public function 一般ユーザーがお知らせを追加できない(): void
    {
        $newsItem = [
            'title' => 'おしらせ',
            'content' => '本文',
            'published_at' => now(),
        ];

        $beforeCount = NewsItem::count();
        $response = $this->actingAs($this->normalUser)->postJson('/api/admin/news', $newsItem);

        $response->assertStatus(403);
        $this->assertDatabaseCount('news_items', $beforeCount);
    }

    #[Test]
    public function 一般ユーザーがお知らせを編集できない(): void
    {
        $target = NewsItem::query()->latest('id')->first();
        $original = [
            'id' => $target->id,
            'title' => $target->title,
            'content' => $target->content,
            'published_at' => \Carbon\Carbon::parse($target->published_at)->format('Y-m-d H:i:s'),
        ];


        $editTarget = [
            'id' => $target->id,
            'title' => '変更したタイトル',
            'content' => '変更した本文',
            'published_at' => \Carbon\Carbon::parse($target->published_at)->format('Y-m-d H:i:s'),
        ];

        $response = $this->actingAs($this->normalUser)->postJson('/api/admin/news', $editTarget);
        $response->assertStatus(403);
        $this->assertDatabaseHas('news_items', $original);
    }

    #[Test]
    public function 管理者がお知らせを削除できる(): void
    {
        $target = NewsItem::query()->latest('id')->first();
        $response = $this->actingAs($this->adminUser)->deleteJson("/api/admin/news/{$target->id}");
        $response->assertNoContent();
        $this->assertDatabaseMissing('news_items', ['id' => $target->id]);
    }

    #[Test]
    public function 一般ユーザーがお知らせを削除できない(): void
    {
        $target = NewsItem::query()->latest('id')->first();
        $beforeCount = NewsItem::count();

        $response = $this->actingAs($this->normalUser)->deleteJson("/api/admin/news/{$target->id}");
        $response->assertStatus(403);
        $this->assertDatabaseCount('news_items', $beforeCount);
    }
}
