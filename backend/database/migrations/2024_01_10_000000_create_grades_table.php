<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('submissions')->onDelete('cascade');
            $table->integer('score');
            $table->foreignId('graded_by')->constrained('users')->onDelete('cascade');
            $table->dateTime('graded_at');
            $table->timestamps();

            $table->index('submission_id');
            $table->index('graded_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
