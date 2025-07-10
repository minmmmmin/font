const HowToUse = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-800">How to Use</h2>

      <p className="mb-6 text-gray-700">
        このツールでは、Google Fonts
        の人気データを可視化しています。フォントを選ぶと、
        そのフォントの利用傾向がさまざまなグラフで表示されます。
        デザインや選定の参考に、自由に使ってみてください。
      </p>

      <ol className="list-decimal ml-6 space-y-4 text-gray-800">
        <li>
          <strong>フォントを選ぶ：</strong>
          上部の検索ボックスから好きなフォントを選択してください。リアルタイムで候補が絞り込まれます。
        </li>
        <li>
          <strong>グラフを見る：</strong>
          選んだフォントに関する様々なデータ（使用ブラウザ比率、OS比率、人気推移など）が自動で表示されます。
        </li>
        <li>
          <strong>データの傾向を楽しむ：</strong>
          時系列のトレンドや環境ごとの使用比率から、フォントの「使われ方の特徴」を探ってみましょう。
        </li>
      </ol>

      <p className="mt-8 text-gray-600 text-sm">
        ※データは Google Fonts
        の公開APIや解析データに基づいており、実際の使用状況と異なる場合があります。
      </p>
    </div>
  );
};

export default HowToUse;
