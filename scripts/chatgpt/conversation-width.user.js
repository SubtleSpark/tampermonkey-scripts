// ==UserScript==
// @name         ChatGPT Conversation Width
// @namespace    https://github.com/SubtleSpark/tampermonkey-scripts
// @version      1.0.0
// @description  Adjust ChatGPT conversation and composer width, with a configurable maximum width.
// @homepageURL  https://github.com/SubtleSpark/tampermonkey-scripts
// @supportURL   https://github.com/SubtleSpark/tampermonkey-scripts/issues
// @updateURL    https://raw.githubusercontent.com/SubtleSpark/tampermonkey-scripts/main/scripts/chatgpt/conversation-width.user.js
// @downloadURL  https://raw.githubusercontent.com/SubtleSpark/tampermonkey-scripts/main/scripts/chatgpt/conversation-width.user.js
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const DEFAULT_WIDTH = 1280; // px; 0 means use the full available width.
  const WIDTH_KEY = 'chatgpt-conversation-width';
  const ENABLED_KEY = 'chatgpt-conversation-width-enabled';

  function parseWidth(value) {
    const text = String(value).trim();
    if (!/^\d+$/.test(text)) return null;
    const n = Number(text);
    return n === 0 || (n >= 640 && n <= 5120) ? n : null;
  }

  let width = parseWidth(GM_getValue(WIDTH_KEY, DEFAULT_WIDTH)) ?? DEFAULT_WIDTH;
  let enabled = GM_getValue(ENABLED_KEY, true) !== false;
  const style = GM_addStyle('');

  const containers = [
    '[class~="max-w-(--thread-body-max-width)"]',
    '[class~="max-w-[var(--thread-body-max-width)]"]',
    '[class~="max-w-(--thread-content-max-width)"]',
    '[class~="max-w-[var(--thread-content-max-width)]"]',
    '[data-turn] > div > [class*="--thread-content-max-width"]',
    '#thread-bottom-container [class*="--thread-content-max-width"]',
    'main [data-testid^="conversation-turn-"] > div > .mx-auto[class*="max-w-"]',
    'main .mx-auto[class*="max-w-"]:has(#prompt-textarea)',
    'main form:has(#prompt-textarea)',
    '#thread-bottom-container form:has(#prompt-textarea)'
  ].join(',\n');

  function apply() {
    const maxWidth = width === 0 ? '100%' : `${width}px`;

    style.textContent = enabled ? `
      @media (min-width: 768px) {
        ${containers} {
          --thread-content-max-width: ${maxWidth} !important;
          --thread-body-max-width: ${maxWidth} !important;
          width: 100% !important;
          max-width: min(${maxWidth}, 100%) !important;
          min-width: 0 !important;
          margin-inline: auto !important;
          box-sizing: border-box !important;
        }

        :is([data-message-author-role="assistant"], [data-turn="assistant"])
        .markdown {
          max-width: none !important;
        }
      }
    ` : '';
  }

  function save() {
    GM_setValue(WIDTH_KEY, width);
    GM_setValue(ENABLED_KEY, enabled);
    apply();
  }

  GM_registerMenuCommand('设置会话宽度…', () => {
    const input = window.prompt(
      `当前：${enabled ? '已加宽' : '原始布局'}，宽度：${width === 0 ? '占满可用区域' : width + 'px'}\n\n` +
      '请输入 640～5120 的整数，例如 1100、1280、1440。\n' +
      '输入 0：占满可用区域，保留页面原有边距。',
      String(width)
    );

    if (input === null) return;

    const next = parseWidth(input);
    if (next === null) {
      window.alert('请输入 640～5120 的整数，或输入 0。');
      return;
    }

    width = next;
    enabled = true;
    save();
  });

  GM_registerMenuCommand('切换：加宽 / 原始布局', () => {
    enabled = !enabled;
    save();
  });

  GM_registerMenuCommand('恢复默认加宽（1280px）', () => {
    width = DEFAULT_WIDTH;
    enabled = true;
    save();
  });

  apply();
})();
