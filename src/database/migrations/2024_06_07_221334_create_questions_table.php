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
            $table->string('exam_code');
            $table->string('question_code');
            $table->text('text');
            $table->enum('type', ['textarea', 'radio', 'input', 'checkbox']);
            $table->json('options')->nullable();
            $table->integer('max_length')->nullable();
            $table->longText('text_for_ai')->nullable();
            $table->timestamps();

            $table->primary(['exam_code', 'question_code']);
            $table->foreign('exam_code')
                ->references('exam_code')
                ->on('exam_sentences')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
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
