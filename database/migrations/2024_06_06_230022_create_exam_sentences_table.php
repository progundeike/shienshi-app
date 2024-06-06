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
        Schema::create('exam_sentences', function (Blueprint $table) {
            $table->id();
            $table->integer('exam_year');
            $table->enum('exam_season', ['haru', 'aki']);
            $table->unsignedBigInteger('exam_id');
            $table->text('sentence');
            $table->text('purpose')->nullable();
            $table->text('review_comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_sentences');
    }
};
