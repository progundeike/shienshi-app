<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_answers', function (Blueprint $table) {
            $table->string('exam_code');
            $table->string('question_code');
            $table->text('user_text')->nullable();
            $table->text('ai_rating')->nullable();
            $table->text('ai_text')->nullable();
            $table->timestamps();

            $table->primary(['user_id', 'exam_code', 'question_code']);
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign(['exam_code', 'question_code'])
                ->references(['exam_code', 'question_code'])
                ->on('questions')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_answers');
    }
};
