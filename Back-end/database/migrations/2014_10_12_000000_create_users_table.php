<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('veterinaire', function (Blueprint $table) {
            $table->id();
            $table->string('siret');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('pwd');
            // $table->boolean('isVet');
            $table->integer('isClient')->default('0')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('veterinaire');

        // Schema::table('veterinaire', function (Blueprint $table) {


        //     // 2. Drop the column
        //     $table->dropColumn('isClient');
        // });
    }
};
