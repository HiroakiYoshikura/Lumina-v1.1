import { PresetConfig, PresetId, ModelType } from './types';

export const PRESETS: PresetConfig[] = [
  {
    id: PresetId.CUSTOM,
    name: 'カスタム (Custom)',
    description: '高度な推論を用いた自由な生成と編集。アスペクト比も選択可能。',
    iconName: 'Sliders',
    model: ModelType.GEMINI_3_PRO,
    aspectRatio: '1:1',
    fields: [
      { key: 'prompt', label: 'プロンプト', placeholder: '自由に記述してください...', type: 'textarea' },
      { key: 'aspectRatio', label: 'アスペクト比', placeholder: '1:1', type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4'] }
    ]
  },
  {
    id: PresetId.PRODUCT_STUDIO,
    name: '商品撮影 (Product Studio)',
    description: 'スタジオ照明、クリーンな背景。商品モックアップに最適。',
    iconName: 'Package',
    model: ModelType.IMAGEN_4,
    aspectRatio: '1:1',
    fields: [
      { key: 'subject', label: '商品名・タイプ', placeholder: '例: 高級な香水ボトル', type: 'text' },
      { key: 'background', label: '背景のコンテキスト', placeholder: '例: 柔らかな照明の大理石の台座', type: 'text' },
      { key: 'color', label: 'メインカラー', placeholder: '例: ゴールドとホワイト', type: 'text' }
    ]
  },
  {
    id: PresetId.LOGO_DESIGN,
    name: 'ロゴデザイン (Logo Design)',
    description: 'ベクタースタイル、ネガティブスペース、クリーンなライン。',
    iconName: 'PenTool',
    model: ModelType.IMAGEN_4,
    aspectRatio: '1:1',
    fields: [
      { key: 'brandName', label: 'ブランド名', placeholder: '例: LUMINA', type: 'text' },
      { key: 'symbol', label: 'シンボル/アイコン', placeholder: '例: スタイリッシュなキツネの頭', type: 'text' },
      { key: 'style', label: 'スタイル', placeholder: 'ミニマリスト, フラット, グラデーション', type: 'select', options: ['Minimalist', 'Abstract', 'Geometric', 'Vintage', 'Flat'] }
    ]
  },
  {
    id: PresetId.PORTRAIT_PRO,
    name: 'ポートレート (Portrait Pro)',
    description: '被写界深度（ボケ味）のある高品質な人物写真。',
    iconName: 'User',
    model: ModelType.IMAGEN_4,
    aspectRatio: '3:4',
    fields: [
      { key: 'subject', label: '被写体の詳細', placeholder: '例: ネオンの眼鏡をかけたサイバーパンクの戦士', type: 'textarea' },
      { key: 'lighting', label: 'ライティング', placeholder: '例: 映画のようなレンブラント照明', type: 'text' }
    ]
  },
  {
    id: PresetId.STORYBOARD,
    name: '絵コンテ (Storyboard)',
    description: '複雑な構図や物語の文脈を理解して描画。',
    iconName: 'Film',
    model: ModelType.GEMINI_3_PRO,
    aspectRatio: '16:9',
    fields: [
      { key: 'scene', label: 'シーンの説明', placeholder: 'アクション、キャラクター、設定を詳しく記述...', type: 'textarea' },
      { key: 'mood', label: '雰囲気 (Mood)', placeholder: '例: 緊張感、楽しげ、哀愁', type: 'text' }
    ],
    systemInstruction: "You are an expert storyboard artist. Create highly detailed, cinematic scenes based on the user's narrative."
  },
  {
    id: PresetId.INFOGRAPHIC,
    name: '図解 (Infographic)',
    description: '正確なテキストレンダリングを用いたデータ視覚化。',
    iconName: 'BarChart',
    model: ModelType.GEMINI_3_PRO,
    aspectRatio: '16:9',
    fields: [
      { key: 'topic', label: 'トピック', placeholder: '例: 水の循環サイクル', type: 'text' },
      { key: 'elements', label: '主要要素', placeholder: '視覚化するデータポイントやステップをリスト化', type: 'textarea' }
    ],
    systemInstruction: "You are an infographic designer. Generate clear, educational diagrams with readable text labels."
  }
];

export const ASPECT_RATIOS = ['1:1', '3:4', '4:3', '16:9', '9:16'];