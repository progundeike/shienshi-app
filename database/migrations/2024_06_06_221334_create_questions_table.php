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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('year');
            $table->enum('season', ['haru', 'aki']);
            $table->unsignedBigInteger('section');
            $table->unsignedBigInteger('question_number');
            $table->unsignedBigInteger('sub_question_number');
            $table->unsignedBigInteger('small_question_number')->default(0);
            $table->text('text');
            $table->enum('type', ['textarea', 'radio', 'input']);
            $table->json('options')->nullable();
            $table->integer('max_length')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
