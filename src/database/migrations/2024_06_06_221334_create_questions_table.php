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
            $table->string('exam_code');
            $table->unsignedBigInteger('question_number');
            $table->unsignedBigInteger('sub_question_number');
            $table->unsignedBigInteger('small_question_number')->default(0);
            $table->text('text');
            $table->enum('type', ['textarea', 'radio', 'input', 'checkbox']);
            $table->json('options')->nullable();
            $table->integer('max_length')->nullable();
            $table->longText('text_for_ai')->nullable();
            $table->timestamps();
            $table->unique(['exam_code', 'question_number', 'sub_question_number', 'small_question_number'], 'uq_question_composite');
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
