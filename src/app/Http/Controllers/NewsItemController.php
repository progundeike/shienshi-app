<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;
use App\Models\NewsItem;
use Illuminate\Support\Facades\Log;

class NewsItemController extends Controller
{
    public function index()
    {
        $newsItems = NewsItem::orderBy('published_at', 'desc')->get();
        return response()->json($newsItems);
    }

    public function createOrUpdate(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'nullable|integer',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'published_at' => 'required|date',
        ]);

        $data = [
            'title' => $validatedData['title'],
            'content' => $validatedData['content'] ?? null,
            'published_at' => $validatedData['published_at'],
        ];

        if (empty($validatedData['id'])) {
            // 新規作成
            $this->authorize('create', NewsItem::class);
            $newsItem = NewsItem::create($data);
            return response()->json(['message' => 'News item created successfully', 'newsItem' => $newsItem], 201);
        } else {
            // 更新
            $newsItem = NewsItem::findOrFail($validatedData['id']);
            $this->authorize('update', $newsItem);
            $newsItem->update($data);
            return response()->json(['message' => 'News item updated successfully', 'newsItem' => $newsItem], 200);
        }
    }

    public function delete(Request $request, NewsItem $newsItem)
    {
        $this->authorize('delete', $newsItem);
        $newsItem->delete();

        return response()->json(['message' => 'News item deleted successfully'], 200);
    }
}
