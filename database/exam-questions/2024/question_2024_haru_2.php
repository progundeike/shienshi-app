<?php
// 令和6年春問2
return [
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 1,
        'sub_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<EOF
[DDoS攻撃に対する調査]について答えよ。
(1) 表4中の[空欄 a]に入れる攻撃の例を,H社での攻撃対象を示して具体的に答えよ。
EOF,
        'options' => json_encode([
            ['label' => '[a]', 'value' => 'a'],
        ]),
        'max_length' => null,
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 1,
        'sub_question_number' => 2,
        'type' => 'input',
        'text' => '(2) 本文中の下線①の場合に発生する弊害を,25字以内で答えよ。',
        'max_length' => 25,
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 1,
        'sub_question_number' => 3,
        'small_question_number' => 1,
        'type' => 'radio',
        'text' => <<<'EOF'
(3) 本文中の[空欄 b], [空欄 c]に入れる適切な字句を,"DNS-F"又は"DNS-K"から選び答えよ。
[b]
EOF,
        'options' => json_encode([
            ['label' => 'DNS-F', 'value' => 'DNS-F'],
            ['label' => 'DNS-K', 'value' => 'DNS-K'],
        ]),
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 1,
        'sub_question_number' => 3,
        'small_question_number' => 2,
        'type' => 'radio',
        'text' => '[c]',
        'options' => json_encode([
            ['label' => 'DNS-F', 'value' => 'DNS-F'],
            ['label' => 'DNS-K', 'value' => 'DNS-K'],
        ]),
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 2,
        'sub_question_number' => 1,
        'small_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<'EOF'
[対策V-1 についての検討]について答えよ。
(1) 表5中の[空欄 d],[空欄 e]に入れる,不正な接続までの攻撃手順を,具体的に答えよ。
EOF,
        'max_length' => null,
        'options' => json_encode([
            ['label' => '[d]', 'value' => 'd'],
        ]),
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 2,
        'sub_question_number' => 1,
        'small_question_number' => 2,
        'type' => 'textarea',
        'text' => '',
        'max_length' => null,
        'options' => json_encode([
            ['label' => '[e]', 'value' => 'e'],
        ]),
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 2,
        'sub_question_number' => 2,
        'type' => 'textarea',
        'text' => '(2) 本文中の下線②について,注意喚起の内容を,具体的に答えよ。',
        'max_length' => null,
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 3,
        'sub_question_number' => 1,
        'type' => 'input',
        'text' => <<<'EOF'
[対策 V-3についての検討]について答えよ。
(1) 本文中の下線③について,設定Pを突破する方法を,30字以内で答えよ。
EOF,
        'max_length' => 30,
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 3,
        'sub_question_number' => 2,
        'type' => 'input',
        'text' => '(2) 本文中の下線④について,突破されないのはなぜか。40字以内で答えよ。',
        'max_length' => 40,
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 4,
        'sub_question_number' => 1,
        'type' => 'input',
        'text' => <<<'EOF'
[DDoS攻撃に対する具体的対策の検討]について答えよ。 
(1) 本文中の下線⑤について,利用する外部のサービスを,20字以内で具体的に答えよ。
EOF,
        'max_length' => 20,
    ],
    [
        'year' => 2024,
        'season' => 'haru',
        'section' => 2,
        'question_number' => 4,
        'sub_question_number' => 2,
        'type' => 'input',
        'text' => '(2) 本文中の下線⑥について,軽減できる理由を,40字以内で答えよ。',
        'max_length' => 40,
    ],
];
