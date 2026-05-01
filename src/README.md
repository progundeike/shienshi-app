## 設問の形式

sub_question_numberは1から割り振る
一つの問いの中に[a],[b]のように複数の問題がある場合は、small_question_numberを1から振り分ける。ない場合は0とする。
small_question_number = 1には問題文を格納する。
small_question_number = 2以降はtextは’’で空文字を格納する。optionsに、解答欄の横に表示したい記号を入力しておく。

## 過去問のデータについて

設問ごとにオリジナルのPDFを120%に拡大して出力
ファイル名は 2023_aki_1.pdf の形式
問題文の下線は<下線①>コンテナによる仮想化の脆弱性を悪用しなくても成功してしまうもの</下線①>で表現
空欄は、[空欄 あ]、[空欄 a]形式とする

## デプロイ

デプロイ前にappコンテナで./scripts/preflight.shでCIを実行
