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
            $table->id();
            $table->foreignId('submit_id')->references('id')->on('answer_submits')->onDelete('cascade');
            $table->string('exam_year');
            $table->enum('exam_season', ['haru', 'aki']);
            $table->unsignedBigInteger('question_id');
            $table->unsignedBigInteger('sub_question_id');
            $table->text('text')->nullable();
            $table->timestamps();
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
