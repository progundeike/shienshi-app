<?php

return [
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '1_1_0',
        'text' => '公開Webサーバ,取引先向けWebサーバを攻撃対象に,HTTP GETリクエストを繰返し送る。',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '1_2_0',
        'text' => '正常な通信を異常として検知してしまう。',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '1_3_1',
        'text' => 'DNS-K',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '1_3_2',
        'text' => 'DNS-F',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '2_1_1',
        'text' => '攻撃者が,正規のVPNダイアログに利用者IDとパスワードを入力すると,正規利用者のスマートフォンにセキュリティコードが送信される。',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '2_1_2',
        'text' => '正規利用者が受信したセキュリティコードを,罠のWebサイトに入力すると,攻撃者がそれを読み取り,正規のセキュリティコード入力画面に入力することで認証される。',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '2_2_0',
        'text' => '認証情報の入力は,受信したメール内のURLリンクをクリックして起動した画面には行わず,VPNダイアログにだけ行う。',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '3_1_0',
        'text' => '盗聴したパケットと同じ順番に通信要求を送信する。',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '3_2_0',
        'text' => 'SPAパケットはユニークであり,同じパケットを再利用すると破棄されるから',
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '4_1_0',
        'text' => <<<'EOF'
(解答例1) DDoS対策機能を有するCDNサービス
(解答例2) クラウド型ファイアウォールサービス
(解答例3) ISPが提供するDDoS防御サービス
EOF,
    ],
    [
        'exam_code' => '2024_haru_2',
        'question_code' => '4_2_0',
        'text' => <<<'EOF'
(解答例1) 取引専用PC以外からの通信は取引先向けWebサーバに到達しないから
(解答例2) UTMの設定変更によって,ボットネットからの通信が遮断されるから
(解答例3) UTMの設定変更に伴って,外部からの接続対象サーバではなくなったから
EOF,
    ],
];
