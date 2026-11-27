// 実行: node --test tests/frontend/exam-tools.test.cjs
// TypeScriptは既存依存を利用。ブラウザ・DB・外部通信を使わない処理テスト。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(relativePath, dependencies = {}) {
    const filename = path.resolve(__dirname, '../../resources/ts', relativePath);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const module = { exports: {} };
    new Function('module', 'exports', 'require', code)(module, module.exports, name => dependencies[name] ?? require(name));
    return module.exports;
}

const { createExamPdfWindowOpener } = load('utils/examPdfWindow.ts');
const { clampMemoPosition, readExamMemo, saveExamMemo } = load('utils/examMemo.ts');
const { formatExamTitle, getExamTitleParts } = load('utils/examTitle.ts');

test('PC用のPDF・メモは初回モバイルでは作らず、PC表示後は同じkeyで保持する', () => {
    const react = require('react');
    let mobile = true;
    let params = { year: '2025', season: 'aki', section: '1' };
    const state = [];
    let cursor = 0;
    let effects = [];
    const componentNames = {
        '../molecules/ExamHeader': 'ExamHeader', '../molecules/ExamActions': 'ExamActions',
        './Page404': 'Page404', './LoadingPage': 'LoadingPage',
        '../organisms/DisplayExamPdf': 'DisplayExamPdf',
        '../organisms/AnswerAndCorrectionForm': 'AnswerAndCorrectionForm',
        '../organisms/ExamMemoWindow': 'ExamMemoWindow',
    };
    const { ExamPage } = load('components/pages/ExamPage.tsx', {
        ...Object.fromEntries(Object.entries(componentNames).map(([name, component]) => [name, { [component]: component }])),
        react: { ...react, memo: fn => fn, useRef: value => ({ current: value }),
            useState: initial => {
                const i = cursor++;
                if (!(i in state)) state[i] = initial;
                return [state[i], value => { state[i] = value; }];
            }, useEffect: fn => effects.push(fn) },
        '@chakra-ui/react': { ...Object.fromEntries(['Alert', 'AlertIcon', 'Box', 'Button', 'Flex', 'Link', 'Text'].map(name => [name, name])), useBreakpointValue: () => mobile },
        'react-split': { default: 'Split' }, 'react-router-dom': { useParams: () => params },
        '../../hooks/useExamPdfExists': { useExamPdfExists: () => ({ data: true, isValid: true }) },
        '../../utils/examPdfWindow': { createExamPdfWindowOpener: () => () => true },
    });
    const render = () => {
        cursor = 0; effects = [];
        const tree = ExamPage();
        effects.forEach(fn => fn());
        const nodes = [];
        const walk = node => {
            if (!node || typeof node !== 'object') return;
            if (Array.isArray(node)) return node.forEach(walk);
            nodes.push(node); walk(node.props?.children);
        };
        walk(tree);
        return nodes;
    };
    let nodes = render();
    assert.equal(nodes.some(node => node.type === 'DisplayExamPdf'), false);
    assert.equal(nodes.some(node => node.type === 'ExamMemoWindow'), false);
    mobile = false;
    nodes = render();
    const desktopKey = nodes.find(node => node.type === 'Flex').key;
    const memoKey = nodes.find(node => node.type === 'ExamMemoWindow').key;
    assert.notEqual(desktopKey, memoKey, '兄弟要素のkeyを重複させない');
    mobile = true;
    nodes = render();
    assert.equal(nodes.some(node => node.type === 'DisplayExamPdf'), true);
    assert.equal(nodes.find(node => node.type === 'Flex').key, desktopKey);
    assert.equal(nodes.find(node => node.type === 'ExamMemoWindow').key, memoKey);
    assert.equal(nodes.find(node => node.type === 'ExamMemoWindow').props.isOpen, false);
    assert.equal(nodes.filter(node => node.type === 'AnswerAndCorrectionForm').length, 1, '非表示の解答欄を動かさない');
    params = { ...params, section: '2' };
    nodes = render();
    assert.equal(nodes.some(node => node.type === 'DisplayExamPdf'), false, 'モバイルで別問題に進んだ時はPDFを作らない');
});

test('PDFを非表示にした時の幅0を無視し、再表示時に幅を更新する', () => {
    const react = require('react');
    const viewport = { clientWidth: 760 };
    const updates = [];
    let effect;
    let resize;
    const oldWindow = global.window;
    const oldObserver = global.ResizeObserver;
    global.window = { location: { origin: 'https://example.test' } };
    global.ResizeObserver = class {
        constructor(callback) { resize = callback; }
        observe() {} disconnect() {}
    };
    try {
        const { DisplayExamPdf } = load('components/organisms/DisplayExamPdf.tsx', {
            react: { ...react, memo: fn => fn, useRef: () => ({ current: viewport }),
                useState: value => [value, next => updates.push(next)], useEffect: fn => { effect = fn; } },
            '@chakra-ui/react': { Box: 'Box', Flex: 'Flex' },
            'react-router-dom': { useParams: () => ({ year: '2025', season: 'aki', section: '1' }) },
            'react-pdf': { pdfjs: { GlobalWorkerOptions: {} }, Document: 'Document', Page: 'Page' },
            'pdfjs-dist/build/pdf.worker.min.mjs?url': { default: 'worker-url' },
            '../molecules/PdfToolbar': { PdfToolbar: 'PdfToolbar' },
            './PdfDrawingOverlay': { PdfDrawingOverlay: 'PdfDrawingOverlay' },
        });
        DisplayExamPdf();
        const cleanup = effect();
        viewport.clientWidth = 0; resize();
        viewport.clientWidth = 820; resize();
        assert.deepEqual(updates, [760, 820]);
        cleanup();
    } finally {
        global.window = oldWindow;
        global.ResizeObserver = oldObserver;
    }
});

for (const [year, season, section, expected] of [
    [2022, 'aki', 1, '2022年 秋期 午後Ⅰ 問1'],
    [2022, 'aki', 5, '2022年 秋期 午後Ⅱ 問2'],
    [2023, 'haru', 3, '2023年 春期 午後Ⅰ 問3'],
    [2023, 'haru', 4, '2023年 春期 午後Ⅱ 問1'],
    [2023, 'haru', 5, '2023年 春期 午後Ⅱ 問2'],
    [2023, 'aki', 1, '2023年 秋期 午後 問1'],
    [2023, 'aki', 4, '2023年 秋期 午後 問4'],
    [2024, 'haru', 4, '2024年 春期 午後 問4'],
    [2025, 'aki', 2, '2025年 秋期 午後 問2'],
]) {
    test(`試験名: ${year}/${season}/${section} → ${expected}`, () => {
        assert.equal(formatExamTitle(year, season, section), expected);
        const parts = getExamTitleParts(year, season, section);
        assert.equal(`${parts.yearLabel} ${parts.sessionLabel}`, expected);
    });
}

test('和暦の改元境界を季節も含めて変換する', () => {
    assert.equal(getExamTitleParts(2018, 'aki', 1).japaneseYearLabel, '平成30年');
    assert.equal(getExamTitleParts(2019, 'haru', 1).japaneseYearLabel, '平成31年');
    assert.equal(getExamTitleParts(2019, 'aki', 1).japaneseYearLabel, '令和1年');
    assert.equal(getExamTitleParts(2023, 'haru', 1).japaneseYearLabel, '令和5年');
});

test('未知の季節・無効な内部番号で架空の問番号を表示しない', () => {
    assert.equal(getExamTitleParts(2023, 'unknown', 1).sessionLabel, '未登録 未登録');
    for (const section of [0, -1, 1.5, NaN, 6]) {
        assert.equal(getExamTitleParts(2023, 'haru', section).sessionLabel, '春期 未登録');
    }
});

test('別画面の再利用・問題変更・閉じた後の再表示', () => {
    const calls = [];
    let focused = 0;
    const popup = { closed: false, location: { href: '' }, focus() { focused++; } };
    global.window = {
        location: { origin: 'https://example.test' },
        open(url, name, features) {
            calls.push({ url, name, features });
            popup.closed = false;
            popup.location.href = url;
            return popup;
        },
    };
    const open = createExamPdfWindowOpener();
    const url = '/exams/2026/haru/1/pdf-window';
    assert.equal(open(url), true);
    assert.equal(open(url), true);
    assert.equal(calls.length, 1, '再クリックで再読み込みしない');
    assert.equal(focused, 2);
    assert.match(calls[0].features, /popup/);
    assert.equal(open('/exams/2026/haru/2/pdf-window'), true);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].name, calls[1].name, '同じ名前の画面を再利用');
    popup.closed = true;
    assert.equal(open(url), true);
    assert.equal(calls.length, 3);
    assert.equal(open('https://outside.test/'), false);
    assert.equal(calls.length, 3, '外部URLを拒否');
});

test('ポップアップブロック・例外を失敗として返す', () => {
    global.window = { location: { origin: 'https://example.test' }, open: () => null };
    const open = createExamPdfWindowOpener();
    assert.equal(open('/exams/2026/haru/1/pdf-window'), false);
    window.open = () => { throw new Error('blocked'); };
    assert.equal(open('/exams/2026/haru/1/pdf-window'), false);
});

test('メモは左右の境界に制限されず、画面内に収まる', () => {
    assert.deepEqual(clampMemoPosition({ x: 800, y: 200 }, 360, 280, 1400, 900), { x: 800, y: 200 });
    assert.deepEqual(clampMemoPosition({ x: 2000, y: 1000 }, 360, 280, 1400, 900), { x: 1040, y: 620 });
    assert.deepEqual(clampMemoPosition({ x: -30, y: -20 }, 360, 280, 1400, 900), { x: 0, y: 0 });
    assert.deepEqual(clampMemoPosition({ x: 800, y: 200 }, 360, 280, 320, 200), { x: 0, y: 0 });
});

test('メモ本文の保存・復元・試験ごとの分離・空欄保存', () => {
    const values = new Map();
    global.sessionStorage = {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
    };
    assert.deepEqual(readExamMemo('exam-1'), { text: '', failed: false });
    assert.equal(saveExamMemo('exam-1', '日本語のメモ\n2行目'), true);
    assert.deepEqual(readExamMemo('exam-1'), { text: '日本語のメモ\n2行目', failed: false });
    assert.equal(readExamMemo('exam-2').text, '');
    assert.equal(saveExamMemo('exam-1', ''), true);
    assert.equal(readExamMemo('exam-1').text, '');
});

test('保存領域が利用不可でも例外を画面へ漏らさない', () => {
    global.sessionStorage = {
        getItem() { throw new Error('denied'); },
        setItem() { throw new Error('quota'); },
    };
    assert.deepEqual(readExamMemo('exam-1'), { text: '', failed: true });
    assert.equal(saveExamMemo('exam-1', '入力中'), false);
});

test('倍率はキーを離す・フォーカスを外す・ドラッグ終了で確定する', () => {
    const react = require('react');
    const chakra = Object.fromEntries(['Box', 'Button', 'Flex', 'IconButton', 'Slider', 'SliderThumb', 'SliderTrack', 'Text'].map(name => [name, name]));
    const { PdfToolbar } = load('components/molecules/PdfToolbar.tsx', {
        react: { ...react, memo: fn => fn, useRef: value => ({ current: value }) },
        '@chakra-ui/react': chakra,
        '../../types/PdfMarker': load('types/PdfMarker.ts'),
    });
    const changed = [];
    const committed = [];
    const tree = PdfToolbar({
        zoom: 100, onZoomChange: value => changed.push(value),
        onZoomChangeEnd: value => committed.push(value),
        tool: 'pointer', onToolChange() {}, markerSize: 1, onMarkerSizeChange() {}, onClear() {},
    });
    const nodes = [];
    const walk = node => {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) return node.forEach(walk);
        nodes.push(node);
        walk(node.props?.children);
    };
    walk(tree);
    const slider = nodes.find(node => node.props?.['aria-label'] === 'PDFの拡大率');
    const thumb = react.Children.toArray(slider.props.children).find(node => node.type === 'SliderThumb');
    for (const [key, value] of [['ArrowRight', 110], ['ArrowLeft', 100], ['Home', 50], ['End', 200], ['PageDown', 180]]) {
        const count = committed.length;
        thumb.props.onKeyDownCapture({ key });
        slider.props.onChange(value);
        slider.props.onChangeEnd(value);
        assert.equal(committed.length, count, 'キーを押している間は確定しない');
        thumb.props.onKeyUp({ key });
        assert.equal(committed.at(-1), value);
    }
    thumb.props.onKeyDownCapture({ key: 'ArrowRight' });
    slider.props.onChange(190);
    thumb.props.onBlur();
    assert.equal(committed.at(-1), 190);
    const count = committed.length;
    slider.props.onChange(120);
    assert.equal(committed.length, count, 'ドラッグ中は確定しない');
    slider.props.onChangeEnd(120);
    assert.equal(committed.at(-1), 120);
    assert.equal(changed.at(-1), 120);
});

test('PDF存在確認は再描画・画面復帰では増えず、試験変更・再試行で実行される', async () => {
    const { QueryClient, QueryObserver } = require('@tanstack/react-query');
    const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
    let options;
    let requests = 0;
    let failure = false;
    const { useExamPdfExists } = load('hooks/useExamPdfExists.ts', {
        '@tanstack/react-query': { useQuery: value => { options = value; return {}; } },
        './useExam': { useExam: () => ({ checkPdfExists: async () => {
            requests++;
            if (failure) throw new Error('network failure');
            return true;
        } }) },
    });
    useExamPdfExists('2025', 'aki', '1');
    const observer = new QueryObserver(client, options);
    const unsubscribe = observer.subscribe(() => {});
    try {
        await observer.refetch();
        assert.equal(requests, 1);
        for (let i = 0; i < 6; i++) {
            // メモ開閉などによる再描画と同じく、関数・optionsを毎回生成する。
            useExamPdfExists('2025', 'aki', '1');
            observer.setOptions({ ...options, staleTime: 0 });
        }
        client.getQueryCache().onFocus();
        client.getQueryCache().onOnline();
        await Promise.resolve();
        assert.equal(requests, 1);
        useExamPdfExists('2025', 'aki', '2');
        observer.setOptions(options);
        await observer.refetch();
        assert.equal(requests, 2);
        failure = true;
        const failed = await observer.refetch();
        assert.equal(failed.isError, true);
        assert.equal(requests, 3, '自動リトライしない');
        failure = false;
        const recovered = await observer.refetch();
        assert.equal(recovered.data, true);
        assert.equal(recovered.isError, false);
        assert.equal(requests, 4);
        assert.equal(useExamPdfExists('2025', 'invalid', '1').isValid, false);
        observer.setOptions(options);
        await Promise.resolve();
        assert.equal(requests, 4, '不正なURLでは確認しない');
    } finally {
        unsubscribe();
        client.clear();
    }
});
