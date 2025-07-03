<?php

// 令和6年春問1
return [
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 1,
        'sub_question_number' => 1,
        'type' => 'input',
        'text' => "本文中の[空欄 a]に入れる適切な字句を答えよ。",
        'max_length' => null,
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 2,
        'sub_question_number' => 1,
        'type' => 'input',
        'text' => <<<EOF
[脆弱性診断の結果]について答えよ。
(1) 表3中の[空欄 b]に入れる適切な数値を,小数点以下を四捨五入して,整数で答えよ。
EOF,
        'max_length' => 30,
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 2,
        'sub_question_number' => 2,
        'small_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<EOF
(2) 表5中の下線①について,修正後のライブラリQで行うJWTの検証では,どのようなデータに対してどのような検証を行うか。検証対象となるデータと検証の内容を,それぞれ20字以内で答えよ。
EOF,
        'max_length' => 20,
        'options' => [
            ['label' => '[データ]', 'value' => 'データ'],
        ],
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 2,
        'sub_question_number' => 2,
        'small_question_number' => 2,
        'type' => 'textarea',
        'text' => "",
        'max_length' => 20,
        'options' => [
            ['label' => '[内容]', 'value' => '内容'],
        ],
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 2,
        'sub_question_number' => 3,
        'type' => 'textarea',
        'text' => '(3) 表5中の下線②について,P呼出し処理に追加すべき処理を,40字以内で具体的に答えよ。',
        'max_length' => 40,
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 2,
        'sub_question_number' => 4,
        'type' => 'textarea',
        'text' => '(4) 表5中[空欄 c]に入れる適切な字句を,表2中の用語で答えよ',
        'max_length' => 30,
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 2,
        'sub_question_number' => 5,
        'type' => 'textarea',
        'text' => '(5) 表5中の[空欄 d]に入れる適切な処理内容を,30字以内で答えよ。',
        'max_length' => 30,
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 3,
        'sub_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<EOF
[新たな脆弱性への対応]について答えよ。
(1) 図7中の下線③について, テストサーバに実装する仕組みを,35字以内で具体的に答えよ。
EOF,
        'max_length' => 35,
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 3,
        'sub_question_number' => 2,
        'small_question_number' => 1,
        'type' => 'input',
        'text' => "(2) 表6中の[空欄 e], [空欄 f]に入れる適切な字句を図5中から選び答えよ。",
        'max_length' => null,
        'options' => [
            ['label' => '[e]', 'value' => 'e'],
        ],
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 3,
        'sub_question_number' => 2,
        'small_question_number' => 2,
        'type' => 'input',
        'text' => "",
        'max_length' => null,
        'options' => [
            ['label' => '[f]', 'value' => 'f'],
        ],
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 3,
        'sub_question_number' => 3,
        'type' => 'input',
        'text' => '(3) 本文中の下線④の変更後の案について,表6中のルール1に記述すべきパターンを,図5の記述形式で答えよ。',
        'max_length' => null,
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 3,
        'sub_question_number' => 3,
        'small_question_number' => 1,
        'type' => 'textarea',
        'text' => '(4) 本文中の下線⑤について,WAFルールの動作に"遮断"ではなく"検知"を設定することによる利点と,"検知"に設定した際に被害を最小化するために実施すべき内容を,それぞれ25字以内で答えよ。',
        'max_length' => 25,
        'options' => [
            ['label' => '[利点]', 'value' => '利点'],
        ],
    ],
    [
        'exam_code' => '2024_haru_1',
        'question_number' => 3,
        'sub_question_number' => 3,
        'small_question_number' => 2,
        'type' => 'textarea',
        'text' => '',
        'max_length' => 25,
        'options' => [
            ['label' => '[内容]', 'value' => '内容'],
        ],
    ],
];
