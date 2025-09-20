import { Link } from "react-router-dom";

const HowToUse = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-green-800">使い方ガイド</h2>

      <p className="mb-6">
        <strong>mojivisual</strong>{" "}
        は、フォント選びをもっと直感的で楽しいものにするためのツールです。
        デザイン制作や資料作成のフォント選定にぜひ活用してください。
      </p>

      <ol className="list-decimal ml-6 space-y-4">
        <li>
          <strong>フォントを選ぶ：</strong>
          ホーム画面の一覧や検索で、試してみたいフォントを見つけましょう。
        </li>
      </ol>

      <p className="mt-8 text-sm text-gray-600">
        ※ 表示されるデータは Google Fonts API や独自解析に基づいており、
        実際の使用状況とは異なる場合があります。
      </p>

      <div className="mt-6 text-center">
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 border border-green-600 text-green-700 font-medium rounded hover:bg-green-50 transition"
        >
          フォント一覧を見てみる
        </Link>
      </div>
    </div>
  );
};

export default HowToUse;
