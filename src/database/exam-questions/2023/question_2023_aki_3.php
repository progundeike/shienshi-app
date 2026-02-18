<?php

// 令和5年秋問3
return [
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 1,
        'sub_question_number' => 1,
        'type' => 'checkbox',
        'text' => '本文中の下線①について,該当するものはどれか。解答群の中から全て選び記号で答えよ。',
        'options' => [
            ['label' => '[ア] CIデーモンのプロセスを中断させる。', 'value' => 'ア'],
            ['label' => '[イ] いずれかのバックエンド上の全プロセスを列挙して攻撃者に送信する。', 'value' => 'イ'],
            ['label' => '[ウ] インターネット上のWebサーバに不正アクセスを試みる。', 'value' => 'ウ'],
            ['label' => '[エ] 攻撃者サイトから命令を取得し,得られた命令を実行する。', 'value' => 'エ'],
            ['label' => '[オ] ほかのNサービス利用者のビルドスクリプトの出力を取得する。', 'value' => 'オ'],
        ],
        'max_length' => null,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 2,
        'sub_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<'EOF'
            [N社のインシデントの発生と対応] について答えよ。

            (1) 本文中の下線②について,攻撃者による不正ログインの方法を,50字以内で具体的に答えよ。
            EOF,
        'max_length' => 50,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 2,
        'sub_question_number' => 2,
        'type' => 'radio',
        'text' => <<<'EOF'
            (2) 本文中の下線③について,RFC 9162 で規定されている技術を,解答群の中から選び,記号で答えよ。
            EOF,
        'options' => [
            ['label' => '[ア] Certificate Transparency', 'value' => 'ア'],
            ['label' => '[イ] HTTP Public Key Pinning', 'value' => 'イ'],
            ['label' => '[ウ] HTTP Strict Transport Security', 'value' => 'ウ'],
            ['label' => '[エ] Registration Authority', 'value' => 'エ'],
        ],
        'max_length' => null,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 2,
        'sub_question_number' => 3,
        'type' => 'radio',
        'text' => '(3) 本文中の下線④について,このような手法の名称を,解答群の中から選び,記号で答えよ。',
        'options' => [
            ['label' => '[ア] DNS スプーフィング', 'value' => 'ア'],
            ['label' => '[イ] ドメインフロンティング', 'value' => 'イ'],
            ['label' => '[ウ] ドメイン名ハイジャック', 'value' => 'ウ'],
            ['label' => '[エ] ランダムサブドメイン攻撃', 'value' => 'エ'],
        ],
        'max_length' => null,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 2,
        'sub_question_number' => 4,
        'type' => 'textarea',
        'text' => '(4) 本文中の下線⑤について,プロセスYがシークレットを取得するのに使った方法として考えられるものを,35字以内で答えよ。',
        'max_length' => 35,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 2,
        'sub_question_number' => 5,
        'type' => 'textarea',
        'text' => '(5) 図2中の下線⑥について,仮に,利用者が偽サイトでログインを試みてしまっても,攻撃者は不正ログインできない。不正ログインを防ぐWebAuthnの仕組みを,40字以内で答えよ。',
        'max_length' => 40,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 2,
        'sub_question_number' => 6,
        'type' => 'radio',
        'text' => '(6) 図2中の[空欄a]に入れる適切な字句を,解答群の中から選び,記号で答えよ。',
        'options' => [
            ['label' => '[ア] CAA', 'value' => 'ア'],
            ['label' => '[イ] CNAME', 'value' => 'イ'],
            ['label' => '[ウ] DNSKEY', 'value' => 'ウ'],
            ['label' => '[エ] NS', 'value' => 'エ'],
            ['label' => '[オ] SOA', 'value' => 'オ'],
            ['label' => '[カ] TXT', 'value' => 'カ'],
        ],
        'max_length' => null,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 3,
        'sub_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<'EOF'
[N社の顧客での対応] について答えよ。

(1) 本文中の下線⑦について,Kさんが開始した対応を踏まえ,予想される攻撃を,40字以内で答えよ。
EOF,
        'max_length' => 40,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 3,
        'sub_question_number' => 2,
        'type' => 'textarea',
        'text' => '(2) 本文中の下線⑧について,必要な対応を,20字以内で答えよ。',
        'max_length' => 20,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 3,
        'sub_question_number' => 3,
        'type' => 'textarea',
        'text' => '(3) 本文中の下線9について,コード署名を付与する際にHSMを使うことによって得られるセキュリティ上の利点を,20字以内で答えよ。',
        'max_length' => 20,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 3,
        'sub_question_number' => 4,
        'small_question_number' => 1,
        'type' => 'textarea',
        'text' => '(4) 本文中の下線⑩について,影響と対応を,それぞれ20字以内で答えよ。',
        'options' => [
            ['label' => '[影響]', 'value' => '影響'],
        ],
        'max_length' => 20,
    ],
    [
        'exam_code' => '2023_aki_3',
        'question_number' => 3,
        'sub_question_number' => 4,
        'small_question_number' => 2,
        'type' => 'textarea',
        'text' => '',
        'options' => [
            ['label' => '[対応]', 'value' => '対応'],
        ],
        'max_length' => 20,
    ],
];
