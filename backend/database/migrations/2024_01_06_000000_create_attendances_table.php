<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'late'])->default('absent');
            $table->timestamps();

            $table->unique(['user_id', 'class_id', 'date']);
            $table->index('user_id');
            $table->index('class_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
