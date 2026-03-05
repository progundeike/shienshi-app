<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Inquiry::class);

        $inquiries = Inquiry::latest()->get();

        return response()->json($inquiries);
    }

    public function store(Request $request)
    {
        // ユーザー情報を確認
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        Inquiry::create($validated);

        $inquiry = new Inquiry($validated);
        $inquiry->user_id = $request->user()?->id;
        $inquiry->save();

        return response()->json(['message' => 'ok'], 201);
    }

    public function destroy(Inquiry $inquiry)
    {
        $this->authorize('delete', $inquiry);
        $inquiry->delete();

        return response()->noContent();
    }
}
