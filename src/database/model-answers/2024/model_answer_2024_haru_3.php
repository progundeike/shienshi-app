<?php

return [
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '1_1_0',
        'text' => '9',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '1_2_0',
        'text' => '攻撃者がわなリンクを用意し,管理者にそのリンクを踏ませることで管理者権限のcookieを攻撃者のWebサイトに送信させ,その値を読み取って利用することで管理者としてサイトXにアクセスし,利用者情報を取得する。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '2_1_0',
        'text' => '攻撃者が自らのアカウントで取得したcsrf tokenと一緒に利用者情報をサイトXに送るように構成したわなフォームに,詐欺メールなどで利用者を誘導し,利用者情報を変更させる。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '2_2_1',
        'text' => '×',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '2_2_2',
        'text' => '×',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '2_2_3',
        'text' => '◯',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '2_2_4',
        'text' => '×',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '3_1_0',
        'text' => 'order-codeの下6桁を総当たりで試行する。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '3_2_0',
        'text' => 'cookieの値で利用者アカウントを特定し,order-codeの値から特定したものと違っていれば,エラーにする。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '4_1_0',
        'text' => '変更後のURLにPOSTデータは送ることができないから',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '4_2_0',
        'text' => 'パラメータpageの値をIMDSのクレデンシャル情報を返すURLに変更する。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '4_3_0',
        'text' => 'トークンを発行するURLにPUTメソッドでアクセスしてトークンを入手し,そのトークンをリクエストヘッダに含めて,IMDSのクレデンシャル情報を返すURLにアクセスする。',
    ],
    [
        'exam_code' => '2024_haru_3',
        'question_code' => '4_4_0',
        'text' => 'パラメータpageの値がサイトP以外のURLならエラーにする。',
    ],
];
