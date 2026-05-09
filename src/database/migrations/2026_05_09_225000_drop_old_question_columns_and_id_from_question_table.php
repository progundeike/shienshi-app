<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['id', 'question_number', 'sub_question_number', 'small_question_number']);
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->primary(['exam_code', 'question_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE questions DROP PRIMARY KEY');

        Schema::table('questions', function (Blueprint $table) {
            $table->bigIncrements('id')->first();
            $table->integer('question_number')->nullable()->after('question_code');
            $table->integer('sub_question_number')->nullable()->after('question_number');
            $table->integer('small_question_number')->nullable()->after('sub_question_number');
        });

        DB::statement("
            UPDATE questions
            SET
                question_number = CAST(SUBSTRING_INDEX(question_code, '_', 1) AS UNSIGNED),
                sub_question_number = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(question_code, '_', 2), '_', -1) AS UNSIGNED),
                small_question_number = CAST(SUBSTRING_INDEX(question_code, '_', -1) AS UNSIGNED)
            ");

        Schema::table('questions', function (Blueprint $table) {
            $table->primary('id');
            $table->unique(['exam_code', 'question_code']);
        });
    }
};
