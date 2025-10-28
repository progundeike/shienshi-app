<?php

return [
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 1,
        'sub_question_number' => 1,
        'type' => 'input',
        'text' => <<<EOF
[XSSについて]について答えよ。
(1)本文中の下線1について,図3中のリクエスト内のスクリプトが出力されるのはどの機能か。表1の詳細機能に対する項番を選び答えよ。
EOF,
        'max_length' => null,
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 1,
        'sub_question_number' => 2,
        'type' => 'textarea',
        'text' => '(2)本文中の下線2について,攻撃者はどのような手順で利用者情報を取得するか。具体的に答えよ。',
        'max_length' => null,
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 2,
        'sub_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<'EOF'
[CSRFについて]について答えよ。
(1)本文中の下線③について,被害を与える攻撃の手順を,具体的に答えよ。
EOF,
        'max_length' => null,
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 2,
        'sub_question_number' => 2,
        'small_question_number' => 1,
        'type' => 'radio',
        'text' => <<<'EOF'
(2)表3中の[空欄 a]〜[空欄 d]に入れる適切な内容を,“○”又は“×”から選び答えよ。
[a]
EOF,
        'options' => [
            ['label' => '◯', 'value' => '◯'],
            ['label' => '×', 'value' => '×'],
        ],
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 2,
        'sub_question_number' => 2,
        'small_question_number' => 2,
        'type' => 'radio',
        'text' => '[b]',
        'options' => [
            ['label' => '◯', 'value' => '◯'],
            ['label' => '×', 'value' => '×'],
        ],
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 2,
        'sub_question_number' => 2,
        'small_question_number' => 3,
        'type' => 'radio',
        'text' => '[c]',
        'options' => [
            ['label' => '◯', 'value' => '◯'],
            ['label' => '×', 'value' => '×'],
        ],
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 2,
        'sub_question_number' => 2,
        'small_question_number' => 4,
        'type' => 'radio',
        'text' => '[d]',
        'options' => [
            ['label' => '◯', 'value' => '◯'],
            ['label' => '×', 'value' => '×'],
        ],
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 3,
        'sub_question_number' => 1,
        'type' => 'input',
        'text' => <<<'EOF'
[認可制御の不備について]について答えよ。
(1) 本文中の下線④について,どのような攻撃手法を用いれば攻撃が成功するか。30字以内で答えよ。
EOF,
        'max_length' => 30,
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 3,
        'sub_question_number' => 2,
        'type' => 'textarea',
        'text' => '(2) 本文中の下線5についてサイトXのWebアプリに追加すべき処理を60字以内で具体的に答えよ。',
        'max_length' => 60,
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 4,
        'sub_question_number' => 1,
        'type' => 'input',
        'text' => <<<'EOF'
[SSRFについて]について答えよ。
(1)本文中の下線⑥について,ログインができないのはなぜか。SSRF攻撃の特徴を基に,35字以内で答えよ。
EOF,
        'max_length' => 35,
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 4,
        'sub_question_number' => 2,
        'type' => 'textarea',
        'text' => '(2) 本文中の下線⑦について,クレデンシャル情報を取得する方法を,具体的に答えよ。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 4,
        'sub_question_number' => 3,
        'type' => 'textarea',
        'text' => '(3) 本文中の下線⑧について,方法Gを用いてクレデンシャル情報を取得する方法を,具体的に答えよ。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_number' => 4,
        'sub_question_number' => 4,
        'type' => 'input',
        'text' => '(4) 本文中の下線⑨について,サイトYのWebアプリに追加すべき処理を,35字以内で具体的に答えよ。',
        'max_length' => 35,
    ],
];
