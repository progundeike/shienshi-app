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
            $table->string('question_code')->nullable()->after('exam_code');
        });

        DB::statement("
            UPDATE questions
            SET question_code = CONCAT(
                question_number,
                '_',
                sub_question_number,
                '_',
                small_question_number
                )
            ");

        Schema::table('questions', function (Blueprint $table) {
            $table->string('question_code')->nullable(false)->change();
            $table->unique(['exam_code', 'question_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('question_code');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropUnique(['exam_code', 'question_code']);
        });
    }
};
