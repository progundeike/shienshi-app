<?php

// 令和5年秋問1
return [
    [
        'year' => 2023,
        'season' => 'aki',
        'section' => 1,
        'question_number' => 1,
        'sub_question_number' => 1,
        'type' => 'radio',
        'text' => <<<EOF
            この攻撃で使われた XSS 脆弱性について答えよ。

            (1) XSS脆弱性の種類を解答群の中から選び, 記号で答えよ
            EOF,
        'options' => json_encode([
            ['label' => 'DOM Based XSS', 'value' => 'ア'],
            ['label' => '格納型 XSS', 'value' => 'イ'],
            ['label' => '反射型 XSS', 'value' => 'ウ'],
        ]),
        'max_length' => null,
    ],
    [
        'year' => 2023,
        'season' => 'aki',
        'section' => 1,
        'question_number' => 1,
        'sub_question_number' => 2,
        'type' => 'textarea',
        'text' => '(2) WebアプリQにおける対策を, 30字以内で答えよ。',
        'max_length' => 30,
    ],
    [
        'year' => 2023,
        'season' => 'aki',
        'section' => 1,
        'question_number' => 2,
        'sub_question_number' => 0,
        'type' => 'textarea',
        'text' => '図3について, 入力文字数制限を超える長さのスクリプトが実行されるようにした方法を, 50字以内で答えよ。',
        'max_length' => 50,
    ],
    [
        'year' => 2023,
        'season' => 'aki',
        'section' => 1,
        'question_number' => 3,
        'sub_question_number' => 1,
        'type' => 'textarea',
        'text' => <<<EOF
            図4のスクリプトについて答えよ。
            
            (1) 図4の6~20行目の処理の内容を, 60字以内で答えよ。
            EOF,
        'max_length' => 60,
    ],
    [
        'year' => 2023,
        'season' => 'aki',
        'section' => 1,
        'question_number' => 3,
        'sub_question_number' => 2,
        'type' => 'textarea',
        'text' => '(2) 攻撃者は, 図4のスクリプトによってアップロードされた情報をどのようにして取得できるか。取得する方法を, 50字以内で答えよ。',
        'max_length' => 50,
    ],
    [
        'year' => 2023,
        'season' => 'aki',
        'section' => 1,
        'question_number' => 3,
        'sub_question_number' => 3,
        'type' => 'textarea',
        'text' => '(3) 攻撃者が(2)で取得した情報を使うことによってできることを, 40字以内で答えよ。',
        'max_length' => 40,
    ],
    [
        'year' => 2023,
        'season' => 'aki',
        'section' => 1,
        'question_number' => 4,
        'sub_question_number' => 0,
        'type' => 'textarea',
        'text' => '仮に, 攻撃者が用意したドメインのサイトに図4と同じスクリプトを含むHTMLを準備し, そのサイトにWebアプリQのログイン済み会員がアクセスしたとしても, Web ブラウザの仕組みによって攻撃は成功しない。この仕組みを, 40字以内で答えよ。',
        'max_length' => 40,
    ],
];
