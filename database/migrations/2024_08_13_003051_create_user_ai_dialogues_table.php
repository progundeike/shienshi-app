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
        Schema::create('user_ai_dialogues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('year');
            $table->enum('season', ['haru', 'aki']);
            $table->unsignedBigInteger('section');
            $table->unsignedBigInteger('question_number');
            $table->unsignedBigInteger('sub_question_number');
            $table->text('user_question');
            $table->text('ai_answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_ai_dialogues');
    }
};
