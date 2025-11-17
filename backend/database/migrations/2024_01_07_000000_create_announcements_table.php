<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->string('type')->default('info'); // info, schedule, etc.
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index('start_at');
            $table->index('end_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
