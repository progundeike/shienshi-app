<?php

namespace App\Console\Commands;

use App\Models\SubmittedExam;
use App\Models\User;
use App\Models\UserAiDialogue;
use App\Models\UserAnswer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetPublicUserData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'demo:reset-public-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset public user data.';

    public function handle(): int
    {
        $user = User::where('username', 'public_user')->first();

        if (! $user) {
            $this->warn('Public user not found.');

            return self::SUCCESS;
        }

        DB::transaction(function () use ($user) {
            UserAiDialogue::where('user_id', $user->id)->delete();
            UserAnswer::where('user_id', $user->id)->delete();
            SubmittedExam::where('user_id', $user->id)->delete();
        });

        $this->info('public_user data reset');

        return self::SUCCESS;
    }
}
