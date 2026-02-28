/**
 * Charites 美化工坊 - SillyTavern Theme Customizer
 * Author: SenriYuki
 */

import { renderExtensionTemplateAsync, extension_settings } from '/scripts/extensions.js';
import { getSlideToggleOptions, saveSettingsDebounced } from '/script.js';
import { slideToggle } from '/lib.js';

const EXTENSION_NAME = 'charites';
const VERSION = '1.0.0';
const EXTENSION_FOLDER = 'third-party/SillyTavern-Charites';
const TEMPLATE_PATH = `${EXTENSION_FOLDER}/assets/templates`;
const STYLE_ID = 'charites-theme-preview';
const STORAGE_KEY = 'charites_themes';

let doNavbarIconClick = null;
function isNewNavbarVersion() { return typeof doNavbarIconClick === 'function'; }

async function initNavbarFunction() {
    try {
        const scriptModule = await import('/script.js');
        if (scriptModule.doNavbarIconClick) doNavbarIconClick = scriptModule.doNavbarIconClick;
    } catch (e) { console.warn('[Charites] doNavbarIconClick 不可用'); }
}

async function getTemplate(name) { return await renderExtensionTemplateAsync(TEMPLATE_PATH, name); }

// =====================
// Icon Definitions
// =====================
const OLD_TOP_ICONS = [
    { id: 'fa-sliders', name: 'AI响应配置', selector: '.drawer-icon.fa-sliders', fa: 'fa-solid fa-sliders' },
    { id: 'fa-plug', name: 'API连接', selector: '.drawer-icon.fa-plug', fa: 'fa-solid fa-plug' },
    { id: 'fa-font', name: 'AI格式化', selector: '.drawer-icon.fa-font', fa: 'fa-solid fa-font' },
    { id: 'fa-book-atlas', name: '世界信息', selector: '.drawer-icon.fa-book-atlas', fa: 'fa-solid fa-book-atlas' },
    { id: 'fa-user', name: '用户设置', selector: '.drawer-icon.fa-user', fa: 'fa-solid fa-user' },
    { id: 'fa-image', name: '背景图', selector: '.drawer-icon.fa-image', fa: 'fa-solid fa-image' },
    { id: 'fa-cubes', name: '扩展', selector: '.drawer-icon.fa-cubes', fa: 'fa-solid fa-cubes' },
    { id: 'fa-bars-progress', name: '数据管理', selector: '.drawer-icon.fa-bars-progress', fa: 'fa-solid fa-bars-progress' },
    { id: 'fa-face-smile', name: '角色管理', selector: '.drawer-icon.fa-face-smile', fa: 'fa-solid fa-face-smile' },
    { id: 'fa-address-card', name: '角色卡', selector: '.drawer-icon.fa-address-card', fa: 'fa-solid fa-address-card' },
];
const NEW_TOP_ICONS = [
    { id: 'n-completions', name: 'AI响应', selector: '#completions_settings .drawer-icon, .drawer-icon.fa-sliders', fa: 'fa-solid fa-sliders' },
    { id: 'n-connections', name: 'API连接', selector: '#connections_settings .drawer-icon, .drawer-icon.fa-plug', fa: 'fa-solid fa-plug' },
    { id: 'n-formatting', name: '格式化', selector: '#formatting_settings .drawer-icon, .drawer-icon.fa-font', fa: 'fa-solid fa-font' },
    { id: 'n-worldinfo', name: '世界信息', selector: '#world_info .drawer-icon, .drawer-icon.fa-book-atlas', fa: 'fa-solid fa-book-atlas' },
    { id: 'n-persona', name: '角色管理', selector: '#persona_drawer .drawer-icon, .drawer-icon.fa-face-smile', fa: 'fa-solid fa-face-smile' },
    { id: 'n-user', name: '用户设置', selector: '#user_settings .drawer-icon, .drawer-icon.fa-user', fa: 'fa-solid fa-user' },
    { id: 'n-backgrounds', name: '背景图', selector: '#backgrounds_settings .drawer-icon, .drawer-icon.fa-image', fa: 'fa-solid fa-image' },
    { id: 'n-extensions', name: '扩展', selector: '#extensions_settings .drawer-icon, .drawer-icon.fa-cubes', fa: 'fa-solid fa-cubes' },
    { id: 'n-data', name: '数据管理', selector: '#data_management .drawer-icon, .drawer-icon.fa-bars-progress', fa: 'fa-solid fa-bars-progress' },
    { id: 'n-charcard', name: '角色卡', selector: '#character_info .drawer-icon, .drawer-icon.fa-address-card', fa: 'fa-solid fa-address-card' },
];
const BOTTOM_ICONS = [
    { id: 'options_button', name: '菜单', selector: '#options_button', fa: 'fa-solid fa-bars' },
    { id: 'extensionsMenuButton', name: '扩展菜单', selector: '#extensionsMenuButton', fa: 'fa-solid fa-cubes' },
    { id: 'send_but', name: '发送', selector: '#send_but', fa: 'fa-solid fa-paper-plane' },
    { id: 'mes_stop', name: '停止', selector: '#mes_stop', fa: 'fa-solid fa-stop' },
    { id: 'qr_rocket', name: '快速回复', selector: '#quick-reply-rocket-button', fa: 'fa-solid fa-rocket' },
];
const FINE_VARS = [
    ['mainText', '主文字'], ['italicsText', '斜体/强调'], ['quoteText', '对话引用'],
    ['underlineText', '下划线'], ['blurTint', '面板底色'], ['chatTint', '聊天区底色'],
    ['userBubble', '用户气泡'], ['botBubble', 'AI气泡'], ['sendFormBg', '底栏背景'],
    ['topBarBg', '顶栏背景'], ['drawerBg', '抽屉面板背景'],
    ['shadow', '阴影色'], ['primary', '主色调'], ['primaryLight', '主色亮'],
];

function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// =====================
// Color Utilities
// =====================
function _hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => { const k = (n + h / 30) % 12; const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * Math.max(0, Math.min(1, c))).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`;
}
function _hexToHsl(hex) {
    hex = hex.replace('#', ''); if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6; else if (max === g) h = ((b - r) / d + 2) / 6; else h = ((r - g) / d + 4) / 6; }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function _hexToRgb(hex) { hex = hex.replace('#', ''); if (hex.length === 3) hex = hex.split('').map(c => c + c).join(''); return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) }; }
function _hexToRgba(hex, a) { if (!hex || !hex.startsWith('#')) return hex || 'transparent'; const { r, g, b } = _hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
function _parseToHexAlpha(str) {
    if (!str || str === 'transparent') return { hex: '#000000', alpha: 0 };
    str = str.trim();
    if (str.startsWith('#')) return { hex: str.length > 7 ? str.slice(0, 7) : str, alpha: 100 };
    const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (m) { const hex = '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join(''); return { hex, alpha: m[4] !== undefined ? Math.round(parseFloat(m[4]) * 100) : 100 }; }
    return { hex: '#000000', alpha: 100 };
}
function _hexAlphaToRgba(hex, alpha) { if (alpha <= 0) return 'transparent'; const { r, g, b } = _hexToRgb(hex); return `rgba(${r},${g},${b},${(alpha / 100).toFixed(2)})`; }

// =====================
// Color Generation
// =====================
function generateColors(hue, sat, bright, colorLight) {
    const isDark = bright <= 50; const s = Math.max(15, sat); const pL = colorLight || 50; const c = {};
    if (isDark) {
        const bgL = 6 + (bright / 50) * 10;
        c.primary = _hslToHex(hue, s, pL); c.primaryLight = _hslToHex(hue, Math.max(s - 12, 25), Math.min(pL + 16, 90));
        c.mainText = _hslToHex(hue, 8, 90); c.italicsText = _hslToHex(hue, Math.min(s + 15, 85), Math.min(pL + 18, 82));
        c.quoteText = _hslToHex(hue, Math.min(s + 8, 75), Math.min(pL + 12, 78)); c.underlineText = _hslToHex(hue, Math.min(s + 10, 78), Math.min(pL + 14, 80));
        c.blurTint = _hslToHex(hue, Math.min(s, 22), bgL); c.chatTint = _hslToHex(hue, Math.min(s, 18), bgL + 2);
        c.userBubble = _hslToHex(hue, Math.min(s, 24), bgL + 8); c.botBubble = _hslToHex(hue, Math.min(s, 18), bgL + 4);
        c.shadow = _hslToHex(hue, Math.min(s, 40), Math.max(pL - 10, 5)); c.border = 'rgba(255,255,255,0.08)';
        c.textMuted = _hslToHex(hue, 6, 63); c.bg = _hslToHex(hue, Math.min(s, 22), bgL);
        c.sendFormBg = _hslToHex(hue, Math.min(s, 24), bgL + 5); c.topBarBg = _hslToHex(hue, Math.min(s, 20), bgL + 3); c.drawerBg = _hslToHex(hue, Math.min(s, 20), bgL + 3);
    } else {
        const bgL = 92 + ((bright - 50) / 50) * 5;
        c.primary = _hslToHex(hue, s, pL); c.primaryLight = _hslToHex(hue, s, Math.max(pL - 8, 10));
        c.mainText = _hslToHex(hue, 8, 12); c.italicsText = _hslToHex(hue, Math.min(s + 15, 85), Math.max(pL - 12, 18));
        c.quoteText = _hslToHex(hue, Math.min(s + 8, 75), Math.max(pL - 8, 22)); c.underlineText = _hslToHex(hue, Math.min(s + 10, 78), Math.max(pL - 10, 20));
        c.blurTint = _hslToHex(hue, Math.min(s, 12), bgL); c.chatTint = _hslToHex(hue, Math.min(s, 10), bgL - 2);
        c.userBubble = _hslToHex(hue, Math.min(s, 16), bgL - 6); c.botBubble = _hslToHex(hue, Math.min(s, 12), bgL - 3);
        c.shadow = _hslToHex(hue, Math.min(s, 30), Math.min(pL + 10, 90)); c.border = 'rgba(0,0,0,0.1)';
        c.textMuted = _hslToHex(hue, 5, 38); c.bg = _hslToHex(hue, Math.min(s, 12), bgL);
        c.sendFormBg = _hslToHex(hue, Math.min(s, 14), bgL - 4); c.topBarBg = _hslToHex(hue, Math.min(s, 12), bgL - 2); c.drawerBg = _hslToHex(hue, Math.min(s, 10), bgL - 3);
    }
    return c;
}

// =====================
// CSS Builder - Raw Mode (imported ST theme passthrough)
// =====================
function buildRawModeCSS(st) {
    const parts = [];
    const v = st._rawStVars || {};

    parts.push(`/* Charites rawMode - 原样还原ST主题 */
:root {
  --SmartThemeBodyColor: ${v.bodyColor || 'rgba(204,204,204,1)'} !important;
  --SmartThemeEmColor: ${v.emColor || 'rgba(204,204,204,1)'} !important;
  --SmartThemeQuoteColor: ${v.quoteColor || 'rgba(204,204,204,1)'} !important;
  --SmartThemeUnderlineColor: ${v.underlineColor || 'rgba(204,204,204,1)'} !important;
  --SmartThemeBlurTintColor: ${v.blurTint || 'rgba(0,0,0,0.5)'} !important;
  --SmartThemeChatTintColor: ${v.chatTint || 'rgba(0,0,0,0.3)'} !important;
  --SmartThemeUserMesBlurTintColor: ${v.userMesTint || 'rgba(0,0,0,0.5)'} !important;
  --SmartThemeBotMesBlurTintColor: ${v.botMesTint || 'rgba(0,0,0,0.2)'} !important;
  --SmartThemeShadowColor: ${v.shadowColor || 'rgba(0,0,0,0.4)'} !important;
  --SmartThemeBorderColor: ${v.borderColor || 'rgba(0,0,0,0.1)'} !important;
}`);

    // Direct element backgrounds to bypass ST's inline style variables
    parts.push(`/* rawMode: 直接设置关键元素背景(绕过ST inline变量覆盖) */
#chat { background: ${v.chatTint || 'transparent'} !important; background-color: ${v.chatTint || 'transparent'} !important; }
.mes .mes_block { background: transparent !important; background-color: transparent !important; }
#top-settings-holder { background: transparent !important; background-color: transparent !important; }
.drawer-content:not(#charites_drawer_content) { background: ${v.blurTint || 'transparent'} !important; background-color: ${v.blurTint || 'transparent'} !important; }`);

    // Imported theme's custom CSS (middle priority - can override defaults above)
    if (st.customCss) parts.push(st.customCss);

    // User UI overrides (highest priority - override everything including custom_css)
    // 必须用 background 简写 + 清 backdrop-filter, 否则 ST 原生的 var() + blur() 会覆盖
    if (st.topBarElBgColor) {
        parts.push(`html body #top-bar { background: ${st.topBarElBgColor} !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; }`);
    }
    if (st.topBarBgColor) {
        parts.push(`html body #top-settings-holder { background: ${st.topBarBgColor} !important; }`);
    }
    if (st.sendFormBgColor) { const prop = st.sendFormBgColor.includes('gradient') ? 'background' : 'background-color'; parts.push(`#send_form, body.no-blur #send_form { ${prop}: ${st.sendFormBgColor} !important; }`); }
    if (st.chatContainerBg) parts.push(`#chat { background-color: ${st.chatContainerBg} !important; }`);

    parts.push(buildIconCSS(st));
    return parts.filter(Boolean).join('\n\n');
}

// =====================
// CSS Builder - Normal Mode
// =====================
function buildThemeCSS(st) {
    if (st.rawMode && st._rawStVars && st.customCss) {
        return buildRawModeCSS(st);
    }

    const base = generateColors(st.hue, st.sat, st.bright, st.colorLight);
    const c = { ...base, ...st.overrides };
    if (st.accent) c.accent = st.accent;
    const isDark = st.bright <= 50;
    const parts = [];
    const uOp = (st.userBubbleOpacity ?? 70) / 100;
    const bOp = (st.botBubbleOpacity ?? (isDark ? 20 : 15)) / 100;

    if (st.fontImportUrl) parts.push(`@import url("${st.fontImportUrl}");`);
    if (st.userNameFontImport) parts.push(`@import url("${st.userNameFontImport}");`);
    if (st.charNameFontImport) parts.push(`@import url("${st.charNameFontImport}");`);

    parts.push(`/* 根变量 */
:root {
  --SmartThemeBodyColor: ${c.mainText};
  --SmartThemeEmColor: ${c.italicsText};
  --SmartThemeQuoteColor: ${c.quoteText};
  --SmartThemeUnderlineColor: ${c.underlineText};
  --SmartThemeBlurTintColor: ${_hexToRgba(c.blurTint, 0.85)};
  --SmartThemeChatTintColor: ${_hexToRgba(c.chatTint, isDark ? 0.5 : 0.3)};
  --SmartThemeUserMesBlurTintColor: ${_hexToRgba(c.userBubble, uOp)};
  --SmartThemeBotMesBlurTintColor: ${_hexToRgba(c.botBubble, bOp)};
  --SmartThemeShadowColor: ${_hexToRgba(c.shadow, 0.5)};
  --SmartThemeBorderColor: ${c.border};
}`);

    if (st.fontFamily) parts.push(`/* 字体 */\nbody { font-family: ${st.fontFamily}; }`);
    if (st.fontScale && st.fontScale !== 100) parts.push(`#chat .mes .mes_text { font-size: ${(st.fontScale / 100).toFixed(2)}em !important; }`);
    if (st.lineHeight && st.lineHeight !== 160) parts.push(`#chat .mes .mes_text { line-height: ${(st.lineHeight / 100).toFixed(2)} !important; }`);

    parts.push(`/* 文字颜色 */
#chat .mes .mes_text { color: ${c.mainText} !important; }
#chat .mes .mes_text em, #chat .mes .mes_text i { color: ${c.italicsText} !important; }
#chat .mes .mes_text q { color: ${c.quoteText} !important; }
#chat .mes .mes_text u { color: ${c.underlineText} !important; }`);
    if (c.accent) parts.push(`#chat .mes .mes_text b, #chat .mes .mes_text strong { color: ${c.accent} !important; }`);

    if (st.textJustify) parts.push(`#chat .mes .mes_text { text-align: justify !important; }`);
    if (st.emDashedBorder) parts.push(`#chat .mes .mes_text em, #chat .mes .mes_text i { border: 1px dashed currentColor; border-radius: 3px; padding: 0 3px; font-style: italic; }`);
    if (st.qDashedUnderline) parts.push(`#chat .mes .mes_text q { text-decoration: underline dashed currentColor 0.5px; text-underline-offset: 3px; }`);
    if (st.hideBrAtStart) parts.push(`#chat .mes .mes_text br:first-child, #chat .mes .mes_text br:nth-child(2), #chat .mes .mes_text br:nth-child(3) { display: none !important; }`);

    // Name fonts
    if (st.userNameFont) parts.push(`/* 用户名字体 */\n#chat .mes[is_user="true"] .name_text { font-family: ${st.userNameFont} !important; }`);
    if (st.charNameFont) parts.push(`/* 角色名字体 */\n#chat .mes:not([is_user="true"]) .name_text { font-family: ${st.charNameFont} !important; }`);

    // Name font size
    if (st.nameFontSize && st.nameFontSize > 0) {
        parts.push(`/* 名字字体大小 */\n#chat .mes .name_text { font-size: ${st.nameFontSize}px !important; }`);
    }

    // Name gradient - USER
    const uNG = !!st.userNameGradient;
    const uNGC1 = st.userNameGradientColor1 || '';
    const uNGC2 = st.userNameGradientColor2 || '';
    const uNGA = st.userNameGradientAngle ?? 180;
    const gradClip = '-webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; background-clip: text !important;';
    if (uNG && uNGC1 && uNGC2) {
        parts.push(`/* USER名字渐变 */\nbody #chat .mes[is_user="true"] .name_text { background: linear-gradient(${uNGA}deg, ${uNGC1}, ${uNGC2}) !important; ${gradClip} }`);
    }
    // Name gradient - CHAR
    if (st.charFollowUserName) {
        if (uNG && uNGC1 && uNGC2) {
            parts.push(`/* CHAR名字渐变(跟随USER) */\nbody #chat .mes[is_user="false"] .name_text, body #chat .mes:not([is_user="true"]) .name_text { background: linear-gradient(${uNGA}deg, ${uNGC1}, ${uNGC2}) !important; ${gradClip} }`);
        }
    } else if (st.charNameGradient && st.charNameGradientColor1 && st.charNameGradientColor2) {
        const cAng = st.charNameGradientAngle || 180;
        parts.push(`/* CHAR名字渐变 */\nbody #chat .mes[is_user="false"] .name_text, body #chat .mes:not([is_user="true"]) .name_text { background: linear-gradient(${cAng}deg, ${st.charNameGradientColor1}, ${st.charNameGradientColor2}) !important; ${gradClip} }`);
    }
    // Name text effects
    const nameEffectProps = [];
    // Stroke: 16方向圆形text-shadow (均匀外描边, 不变形不糊成一坨)
    if (st.nameStrokeWidth > 0) {
        const w = st.nameStrokeWidth, sc = st.nameStrokeColor || '#000';
        const shadows = [];
        for (let i = 0; i < 16; i++) {
            const a = (i / 16) * Math.PI * 2;
            shadows.push(`${(Math.cos(a) * w).toFixed(2)}px ${(Math.sin(a) * w).toFixed(2)}px 0 ${sc}`);
        }
        nameEffectProps.push(`text-shadow: ${shadows.join(', ')} !important`);
    }
    // Shadow + glow via filter: drop-shadow (兼容渐变色文字)
    const dropShadows = [];
    if (st.nameShadowBlur > 0 || st.nameShadowX || st.nameShadowY) {
        dropShadows.push(`drop-shadow(${st.nameShadowX || 0}px ${st.nameShadowY || 0}px ${st.nameShadowBlur || 0}px ${st.nameShadowColor || '#000'})`);
    }
    if (st.nameGlowSize > 0) {
        dropShadows.push(`drop-shadow(0 0 ${st.nameGlowSize}px ${st.nameGlowColor || '#fff'})`);
    }
    if (dropShadows.length) nameEffectProps.push(`filter: ${dropShadows.join(' ')} !important`);
    if (nameEffectProps.length) {
        parts.push(`/* 名字特效 */\nbody #chat .mes .name_text { ${nameEffectProps.join('; ')}; }`);
    }

    // Avatar - ALWAYS force square dimensions to prevent ellipse
    const nameFollow = st.namePosition !== 'default';
    const avOX = st.avatarOffsetX || 0, avOY = st.avatarOffsetY || 0;
    const nmOX = st.nameOffsetX || 0, nmOY = st.nameOffsetY || 0;
    const avTransform = (avOX || avOY) ? `transform: translate(${avOX}px, ${avOY}px) !important;` : '';
    const nmTransform = (nmOX || nmOY) ? `transform: translate(${nmOX}px, ${nmOY}px) !important;` : '';

    if (st.avatarPosition === 'hidden') {
        parts.push(`/* 头像隐藏 */\n#chat .mes .mesAvatarWrapper { display: none !important; }`);
    } else {
        if (st.avatarPosition === 'topLeft') {
            parts.push(`/* 头像顶部居左 */
#chat .mes { display: flex !important; flex-direction: column !important; }
#chat .mes .mesAvatarWrapper { display: flex !important; flex-direction: column !important; align-items: flex-start !important; width: auto !important; padding: 0 !important; margin: 0 !important; ${avTransform} }
#chat .mes .mesAvatarWrapper .avatar { margin-bottom: 4px !important; }
#chat .mes .mesAvatarWrapper .mesIDDisplay,
#chat .mes .mesAvatarWrapper .tokenCounterDisplay,
#chat .mes .mesAvatarWrapper .mes_timer { display: inline-block !important; font-size: 11px !important; margin: 0 3px !important; order: 10 !important; }`);
            if (nameFollow) {
                parts.push(`/* 名字跟随头像-居左 */
#chat .mes .mes_block { width: 100% !important; ${nmTransform} }
#chat .mes .mesIDDisplay, #chat .mes .tokenCounterDisplay, #chat .mes .mes_timer { display: inline-block !important; position: static !important; }`);
            }
        } else if (st.avatarPosition === 'topCenter') {
            parts.push(`/* 头像顶部居中 */
#chat .mes { display: flex !important; flex-direction: column !important; align-items: center !important; }
#chat .mes .mesAvatarWrapper { display: flex !important; flex-direction: column !important; align-items: center !important; width: auto !important; margin: 0 auto !important; padding: 0 !important; ${avTransform} }
#chat .mes .mesAvatarWrapper .avatar { margin: 0 auto 4px !important; }
#chat .mes .mesAvatarWrapper .mesIDDisplay,
#chat .mes .mesAvatarWrapper .tokenCounterDisplay,
#chat .mes .mesAvatarWrapper .mes_timer { display: inline-block !important; font-size: 11px !important; margin: 0 3px !important; order: 10 !important; text-align: center !important; }`);
            if (nameFollow) {
                parts.push(`/* 名字跟随头像-居中 */
#chat .mes .mes_block { width: 100% !important; ${nmTransform} }
#chat .mes .mes_block .ch_name { display: flex !important; justify-content: center !important; align-items: baseline !important; }
#chat .mes .mes_block .ch_name .alignItemsBaseline { display: inline-flex !important; }
#chat .mes .mes_block .ch_name .name_text { text-align: center !important; }
#chat .mes .mesIDDisplay, #chat .mes .tokenCounterDisplay, #chat .mes .mes_timer { display: inline-block !important; position: static !important; text-align: center !important; }`);
            }
        }

        const avSize = st.avatarSize || 50;
        const avR = st.avatarShape === 'square' ? `${st.avatarBorderRadius || 8}px` : '50%';
        parts.push(`/* 头像尺寸(强制正方形防椭圆) */
#chat .mes .avatar {
  width: ${avSize}px !important; height: ${avSize}px !important;
  min-width: ${avSize}px !important; min-height: ${avSize}px !important;
  max-width: ${avSize}px !important; max-height: ${avSize}px !important;
  border-radius: ${avR} !important; overflow: hidden !important;
}
#chat .mes .avatar img {
  width: 100% !important; height: 100% !important;
  object-fit: cover !important; border-radius: ${avR} !important;
}`);

        if (st.avatarFrameUrl) {
            const scale = st.avatarFrameScale || 130;
            parts.push(`/* 头像框 */
#chat .mes .avatar { position: relative !important; overflow: visible !important; }
#chat .mes .avatar::before {
  content: ""; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); z-index: 9; pointer-events: none;
  width: ${scale}%; height: ${scale}%;
  background-image: url("${escHtml(st.avatarFrameUrl)}");
  background-size: contain; background-repeat: no-repeat; background-position: center;
}`);
        }
    }

    // Timestamp position - ch_name is always row flex, timestamp inline by default
    const tsPos = st.timestampPosition || 'default';
    const tsOX = st.timestampOffsetX || 0, tsOY = st.timestampOffsetY || 0;
    const tsTransform = (tsOX || tsOY) ? `transform: translate(${tsOX}px, ${tsOY}px) !important;` : '';

    if (tsPos === 'belowName') {
        parts.push(`/* 时间戳-名字下方 */
body #chat .mes .mes_block .ch_name { flex-wrap: wrap !important; }
body #chat .mes .mes_block .ch_name .alignItemsBaseline { flex-basis: 100% !important; width: 100% !important; }
body #chat .mes .mes_block .ch_name .timestamp { display: block !important; flex-basis: 100% !important; order: 999 !important; margin-top: 2px !important; ${tsTransform} }`);
    } else if (tsPos === 'rightOfName') {
        parts.push(`/* 时间戳-置右 */
body #chat .mes .mes_block .ch_name { position: relative !important; }
body #chat .mes .mes_block .ch_name .timestamp { position: absolute !important; top: 50% !important; right: 0 !important; transform: translate(${tsOX || 0}px, calc(-50% + ${tsOY || 0}px)) !important; }`);
    } else if (tsOX || tsOY) {
        parts.push(`body #chat .mes .mes_block .ch_name .timestamp { ${tsTransform} }`);
    }

    // Bubble separation
    if (st.bubbleBorderRadius > 0) parts.push(`/* 气泡圆角 */\nbody #chat .mes { border-radius: ${st.bubbleBorderRadius}px !important; }`);
    const bGap = st.bubbleGap ?? 10;
    if (bGap !== 10) parts.push(`/* 气泡间距 */\n#chat .mes { margin-bottom: ${bGap}px !important; }`);
    const uAlign = st.userBubbleAlign || 'default';
    const cAlign = st.charBubbleAlign || 'default';
    const uW = st.userBubbleWidth || 100;
    const cW = st.charBubbleWidth || 100;
    const uMH = st.userBubbleMarginH || 0;
    const cMH = st.charBubbleMarginH || 0;
    if (uAlign !== 'default' || uW < 100 || uMH > 0) {
        const ml = uAlign === 'right' ? 'auto' : (uAlign === 'center' ? 'auto' : `${uMH}px`);
        const mr = uAlign === 'left' ? 'auto' : (uAlign === 'center' ? 'auto' : `${uMH}px`);
        parts.push(`/* USER气泡分离 */\nbody #chat .mes[is_user="true"] { max-width: ${uW}% !important; margin-left: ${ml} !important; margin-right: ${mr} !important; }`);
    }
    if (cAlign !== 'default' || cW < 100 || cMH > 0) {
        const ml = cAlign === 'right' ? 'auto' : (cAlign === 'center' ? 'auto' : `${cMH}px`);
        const mr = cAlign === 'left' ? 'auto' : (cAlign === 'center' ? 'auto' : `${cMH}px`);
        parts.push(`/* CHAR气泡分离 */\nbody #chat .mes[is_user="false"], body #chat .mes:not([is_user="true"]) { max-width: ${cW}% !important; margin-left: ${ml} !important; margin-right: ${mr} !important; }`);
    }

    // Bubble backgrounds - charFollowUserBubble only follows COLOR, opacity is always independent
    const userBubbleBase = _hexToRgba(c.userBubble, uOp);
    const charBubbleBase = _hexToRgba(st.charFollowUserBubble ? c.userBubble : c.botBubble, bOp);

    if (st.bubbleGradient) {
        // USER gradient: 主色 → 配色
        const uAngle = st.bubbleGradientAngle || 180;
        const uC1 = st.userBubbleColor1 ? _hexToRgba(st.userBubbleColor1, uOp) : userBubbleBase;
        const uC2 = st.userBubbleColor2 ? _hexToRgba(st.userBubbleColor2, uOp) : userBubbleBase;
        // CHAR gradient: follow USER or own 主色 → 配色
        let cAngle, cC1, cC2;
        if (st.charFollowUserBubble) {
            cAngle = uAngle; cC1 = _hexToRgba(st.userBubbleColor1 || c.userBubble, bOp); cC2 = _hexToRgba(st.userBubbleColor2 || c.userBubble, bOp);
        } else {
            cAngle = st.charBubbleGradientAngle || 180;
            cC1 = st.charBubbleColor1 ? _hexToRgba(st.charBubbleColor1, bOp) : charBubbleBase;
            cC2 = st.botBubbleColor2 ? _hexToRgba(st.botBubbleColor2, bOp) : charBubbleBase;
        }
        parts.push(`/* 气泡渐变 */
body #chat .mes[is_user="true"] { background: linear-gradient(${uAngle}deg, ${uC1}, ${uC2}) !important; }
body #chat .mes[is_user="false"], body #chat .mes:not([is_user="true"]) { background: linear-gradient(${cAngle}deg, ${cC1}, ${cC2}) !important; }`);
    } else {
        parts.push(`/* 气泡背景色 */
body #chat .mes[is_user="true"] { background-color: ${userBubbleBase} !important; }
body #chat .mes[is_user="false"], body #chat .mes:not([is_user="true"]) { background-color: ${charBubbleBase} !important; }`);
    }

    // Backgrounds
    if (st.chatBgUrl) {
        const op = (st.chatBgOpacity || 100) / 100;
        parts.push(`/* 聊天区背景 */\n#chat { background-image: url("${escHtml(st.chatBgUrl)}") !important; background-size: cover !important; background-position: center !important; opacity: ${op}; }`);
    }
    if (st.mesBubbleImgUrl) {
        const h = st.mesBubbleImgHeight || 130;
        parts.push(`/* 气泡顶部图 */\n#chat .mes { position: relative; overflow: visible; }\n#chat .mes::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: ${h}px; background-image: url("${escHtml(st.mesBubbleImgUrl)}"); background-size: 100% auto; background-repeat: no-repeat; background-position: center top; z-index: -1; pointer-events: none; }`);
        if (st.userBubbleImgUrl) parts.push(`#chat .mes[is_user="true"]::before { background-image: url("${escHtml(st.userBubbleImgUrl)}"); }`);
        if (st.botBubbleImgUrl) parts.push(`#chat .mes:not([is_user="true"])::before { background-image: url("${escHtml(st.botBubbleImgUrl)}"); }`);
    }
    if (st.topBarBgUrl) parts.push(`/* 顶栏背景图 */\n#top-settings-holder { background-image: url("${escHtml(st.topBarBgUrl)}") !important; background-size: cover !important; background-position: center !important; }`);
    if (st.containerBgUrl) parts.push(`#top-settings-holder { background-image: url("${escHtml(st.containerBgUrl)}") !important; background-size: cover !important; background-position: center !important; }`);
    if (st.sidebarBgUrl) parts.push(`.drawer-content { background-image: url("${escHtml(st.sidebarBgUrl)}") !important; background-size: cover !important; background-position: center !important; }`);

    const finalSendFormBg = st.sendFormBgColor || c.sendFormBg;
    const sendProp = String(finalSendFormBg).includes('gradient') ? 'background' : 'background-color';
    // topBarElBgColor → #top-bar (顶部栏背景, 实际可见的顶栏元素)
    // ST原生: #top-bar 用 background-color: var(--SmartThemeBlurTintColor) + backdrop-filter: blur()
    // 必须用 background 简写 + 清 backdrop-filter 才能彻底覆盖
    const topBarBg = st.topBarElBgColor || c.topBarBg;
    parts.push(`/* 顶栏/底栏/抽屉背景色 */
html body #top-bar { background: ${topBarBg} !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: none !important; }
html body #top-settings-holder { background: transparent !important; }
#send_form, body.no-blur #send_form { ${sendProp}: ${finalSendFormBg} !important; }
.drawer-content:not(#charites_drawer_content) { background-color: ${c.drawerBg} !important; color: ${c.mainText} !important; }`);
    if (st.topBarBgColor && st.topBarBgColor !== 'transparent' && st.topBarBgColor !== 'rgba(0,0,0,0.00)') {
        parts.push(`html body #top-settings-holder { background: ${st.topBarBgColor} !important; }`);
    }
    if (st.chatContainerBg) parts.push(`/* 聊天区容器背景 */\n#chat { background-color: ${st.chatContainerBg} !important; }\n.mes_block { background-color: transparent !important; }`);

    if (st.sendFormRadius) parts.push(`/* 底栏圆角 */\n#send_form { border-radius: ${st.sendFormRadius}px !important; }`);
    if (st.sendFormBgUrl) parts.push(`/* 底栏背景图 */\n#send_form { background-image: url("${escHtml(st.sendFormBgUrl)}") !important; background-size: cover !important; background-position: center !important; }`);

    // Accent borders
    if (st.mesBorder) {
        const bc = st.mesBorderColor || c.accent || c.primary;
        parts.push(`/* 消息边框 */\n#chat .mes { border: ${st.mesBorderWidth || 1}px solid ${bc} !important; border-radius: ${st.mesBorderRadius ?? 8}px !important; }`);
    }
    if (st.quoteBorderLeft) {
        parts.push(`/* 引用左边框 */\n#chat .mes .mes_text q, #chat .mes .mes_text blockquote { border-left: 3px solid ${st.quoteBorderColor || c.accent || c.quoteText} !important; padding-left: 10px; margin-left: 4px; }`);
    }
    if (st.codeBorder) {
        const cbc = st.codeBorderColor || c.accent || c.primary;
        parts.push(`/* 代码边框 */\n#chat .mes .mes_text code:not(pre code) { border: 1px solid ${cbc} !important; border-radius: 4px; padding: 1px 4px; }\n#chat .mes .mes_text pre { border: 1px solid ${cbc} !important; border-radius: 6px; }`);
    }

    // Popup
    if (st.popupBg || st.popupRadius || st.popupBorder || st.popupBlur) {
        let p = '/* 弹窗 */\n.popup, #dialogue_popup, #options, .list-group { ';
        if (st.popupBg) p += `background-color: ${st.popupBg} !important; `;
        if (st.popupRadius) p += `border-radius: ${st.popupRadius}px !important; `;
        if (st.popupBorder) p += `border: 1px solid ${st.popupBorder} !important; `;
        if (st.popupBlur) p += `backdrop-filter: blur(${st.popupBlur}px) !important; `;
        p += '}'; parts.push(p);
    }

    // Thinking chain
    if (st.thinkingText) parts.push(`/* 思维链 */\n.mes_reasoning_header_title { font-size: 0 !important; }\n.mes_reasoning_header_title::before { content: "${escHtml(st.thinkingText)}"; font-size: 14px; color: ${c.textMuted}; font-weight: normal; }`);
    if (st.thinkingDoneImgUrl) parts.push(`.mes_reasoning_details:not([open]) .mes_reasoning_header { background-image: url("${escHtml(st.thinkingDoneImgUrl)}"); background-size: contain; background-repeat: no-repeat; background-position: center; }`);
    if (st.mesAfterText) parts.push(`#chat .mes::after { content: "${escHtml(st.mesAfterText)}"; display: block; text-align: center; font-size: 11px; color: ${c.textMuted}; opacity: 0.6; padding: 8px 0 2px; }`);

    if (st.chatWidth && st.chatWidth !== 55) parts.push(`#chat .mes { max-width: ${st.chatWidth}% !important; margin-left: auto !important; margin-right: auto !important; }`);
    if (st.sidebarWidth === 'narrow') parts.push(`#left-nav-panel, #right-nav-panel { max-width: 250px !important; }`);
    else if (st.sidebarWidth === 'wide') parts.push(`#left-nav-panel, #right-nav-panel { max-width: 450px !important; }`);

    if (st.sendPlaceholder) parts.push(`/* 占位文字 */\n#send_textarea::placeholder { color: transparent !important; }\n#nonQRFormItems { position: relative; }\n#nonQRFormItems:has(#send_textarea:placeholder-shown)::before { content: "${escHtml(st.sendPlaceholder)}"; color: ${c.textMuted}; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.9em; pointer-events: none; z-index: 10; white-space: nowrap; }`);

    // Loading screen
    if (st.preloaderBg) parts.push(`/* 加载背景色 */\n#preloader { background-color: ${st.preloaderBg} !important; }`);
    if (st.preloaderBgUrl) parts.push(`/* 加载背景图 */\n#preloader { background-image: url("${escHtml(st.preloaderBgUrl)}") !important; background-size: cover !important; background-position: center !important; }`);
    if (st.preloaderImgUrl) {
        const sz = st.preloaderImgSize || 40;
        parts.push(`/* 加载图标 */\n#load-spinner { --spinner-size: ${sz}px; background-image: url("${escHtml(st.preloaderImgUrl)}") !important; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; }\n#load-spinner::before { display: none !important; }`);
    }

    // Snippets
    if (st.snippetHideScrollbar) parts.push(`::-webkit-scrollbar { display: none; } * { scrollbar-width: none; }`);
    if (st.snippetNoButtonShadow) parts.push(`button, textarea, input, select { box-shadow: none !important; filter: none !important; }`);
    if (st.snippetTransparentInputBg) parts.push(`#send_textarea, .inline-drawer-header, .standoutHeader { background-color: transparent !important; }`);
    if (st.snippetNoTopBarShadow) parts.push(`#top-settings-holder, #top-bar { box-shadow: none !important; }`);
    if (st.snippetQrHideOnBlur) parts.push(`.qr--buttons { opacity: 0; transition: opacity 0.3s; } .qr--buttons:hover, #send_form:focus-within .qr--buttons { opacity: 1; }`);
    if (st.snippetNoHoverHighlight) parts.push(`.inline-drawer-header:hover, .standoutHeader:hover { filter: none !important; background-color: inherit !important; }`);
    if (st.snippetIconAlwaysOn) parts.push(`#top-settings-holder .drawer-icon { opacity: 1 !important; }`);

    // Top icon styling
    const iconStyleParts = [];
    if (st.topIconSize > 0) iconStyleParts.push(`font-size: ${st.topIconSize}px !important; width: ${st.topIconSize}px !important; height: ${st.topIconSize}px !important;`);
    if (st.topIconColor) iconStyleParts.push(`color: ${st.topIconColor} !important;`);
    if (st.topIconOpacity > 0) iconStyleParts.push(`opacity: ${(100 - st.topIconOpacity) / 100} !important;`);
    if (iconStyleParts.length) parts.push(`/* 顶部图标样式 */\n#top-settings-holder .drawer-icon, #top-bar .fa-solid, #top-bar .fa-fw, #top-settings-holder i { ${iconStyleParts.join(' ')} }`);

    parts.push(buildIconCSS(st));
    if (st.customCss) parts.push(`/* 自定义CSS */\n${st.customCss}`);
    return parts.filter(Boolean).join('\n\n');
}

function buildIconCSS(st) {
    const parts = [];
    const hoverUrls = st.iconHoverUrls || {};
    const hoverAll = st.iconHoverAllUrl || '';

    if (st.iconUrls && Object.keys(st.iconUrls).length > 0) {
        for (const [id, url] of Object.entries(st.iconUrls)) {
            if (!url) continue;
            const allIcons = [...OLD_TOP_ICONS, ...NEW_TOP_ICONS, ...BOTTOM_ICONS, ...(st.customIcons || [])];
            const icon = allIcons.find(i => i.id === id);
            if (!icon) continue;
            const sel = icon.selector;
            const isBottom = BOTTOM_ICONS.some(b => b.id === id);
            if (isBottom) {
                parts.push(`${sel}::before { display: none !important; }\n${sel} > i { display: none !important; }\n${sel} { font-size: 0 !important; width: 35px; height: 35px; background-image: url("${escHtml(url)}") !important; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; background-color: transparent !important; border: none !important; }`);
            } else {
                parts.push(`${sel}::before { content: '' !important; visibility: hidden !important; }\n${sel} { display: block; background-image: url("${escHtml(url)}") !important; background-size: contain !important; background-position: center !important; background-repeat: no-repeat !important; width: 35px; height: 60px; opacity: 1 !important; }`);
            }
        }
    }

    // Hover icon URLs
    if (hoverAll) {
        parts.push(`/* 图标hover效果(全局) */
#top-settings-holder .drawer-icon:hover::before,
#top-settings-holder .drawer-icon:active::before,
#top-settings-holder > div.open .drawer-icon::before {
  color: transparent !important;
  background-image: url("${escHtml(hoverAll)}") !important;
  background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important;
  opacity: 1 !important;
}`);
    }
    for (const [id, hUrl] of Object.entries(hoverUrls)) {
        if (!hUrl) continue;
        const allIcons = [...OLD_TOP_ICONS, ...NEW_TOP_ICONS, ...BOTTOM_ICONS, ...(st.customIcons || [])];
        const icon = allIcons.find(i => i.id === id);
        if (!icon) continue;
        const sel = icon.selector;
        const isBottom = BOTTOM_ICONS.some(b => b.id === id);
        if (isBottom) {
            parts.push(`${sel}:hover, ${sel}:active { background-image: url("${escHtml(hUrl)}") !important; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; color: transparent !important; }\n${sel}:hover::before, ${sel}:active::before { color: transparent !important; }`);
        } else {
            parts.push(`${sel}:hover::before, ${sel}:active::before { color: transparent !important; background-image: url("${escHtml(hUrl)}") !important; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; opacity: 1 !important; }`);
        }
    }

    return parts.join('\n');
}

// =====================
// Settings
// =====================
let settings = {};
const DEFAULT_SETTINGS = {
    hue: 265, sat: 70, colorLight: 50, bright: 25, accent: '#f59e0b',
    overrides: {}, locked: false, previewEnabled: true, showTopIcon: true,
    avatarShape: 'circle', avatarBorderRadius: 50, avatarSize: 50,
    avatarFrameUrl: '', avatarFrameScale: 130, avatarPosition: 'default',
    avatarOffsetX: 0, avatarOffsetY: 0, nameOffsetX: 0, nameOffsetY: 0,
    chatBgUrl: '', chatBgOpacity: 100,
    mesBubbleImgUrl: '', userBubbleImgUrl: '', botBubbleImgUrl: '', mesBubbleImgHeight: 130,
    topBarBgUrl: '', containerBgUrl: '', sidebarBgUrl: '',
    fontFamily: '', fontImportUrl: '', fontScale: 100, lineHeight: 160,
    textJustify: false, emDashedBorder: false, qDashedUnderline: false, hideBrAtStart: false,
    thinkingText: '', thinkingDoneImgUrl: '', mesAfterText: '',
    chatWidth: 55, sidebarWidth: 'normal', sendPlaceholder: '',
    snippetHideScrollbar: false, snippetNoButtonShadow: false, snippetTransparentInputBg: false,
    snippetNoTopBarShadow: false, snippetQrHideOnBlur: false, snippetNoHoverHighlight: false, snippetIconAlwaysOn: false,
    iconUrls: {}, customIcons: [], customCss: '', themeName: '', themeAuthor: '',
    sendFormRadius: 0, sendFormBgUrl: '',
    popupBg: '', popupRadius: 0, popupBorder: '', popupBlur: 0,
    userBubbleOpacity: 70, botBubbleOpacity: 20, charFollowUserBubble: false,
    bubbleGradient: false,
    bubbleGradientAngle: 180, userBubbleColor1: '', userBubbleColor2: '',
    charBubbleGradientAngle: 180, charBubbleColor1: '', botBubbleColor2: '',
    mesBorder: false, mesBorderColor: '', mesBorderWidth: 1, mesBorderRadius: 8,
    quoteBorderLeft: false, quoteBorderColor: '', codeBorder: false, codeBorderColor: '',
    preloaderBg: '', preloaderBgUrl: '', preloaderImgUrl: '', preloaderImgSize: 40,
    particleEffect: 'none', particleLayer: 'global', particleCount: 30, particleSize: 5, particleSpeed: 3, particleColor: '#ffffff',
    mouseEffect: 'none', mouseEffectColor: '#ffffff', mouseEffectSize: 8,
    // Name
    userNameFont: '', charNameFont: '', userNameFontImport: '', charNameFontImport: '',
    nameFontSize: 0, namePosition: 'follow',
    userNameGradient: false, userNameGradientColor1: '', userNameGradientColor2: '', userNameGradientAngle: 180,
    charNameGradient: false, charNameGradientColor1: '', charNameGradientColor2: '', charNameGradientAngle: 180,
    charFollowUserName: false,
    nameStrokeWidth: 0, nameStrokeColor: '#000000',
    nameShadowX: 0, nameShadowY: 0, nameShadowBlur: 0, nameShadowColor: '#000000',
    nameGlowSize: 0, nameGlowColor: '#ffffff',
    // Timestamp position
    timestampPosition: 'default',
    timestampOffsetX: 0, timestampOffsetY: 0,
    // Bubble separation
    bubbleBorderRadius: 0,
    bubbleGap: 10, userBubbleAlign: 'default', charBubbleAlign: 'default',
    userBubbleWidth: 100, charBubbleWidth: 100,
    userBubbleMarginH: 0, charBubbleMarginH: 0,
    // Bar colors (explicit override)
    topBarBgColor: '', sendFormBgColor: '', topBarElBgColor: '',
    chatContainerBg: '',
    // Top icon styling
    topIconSize: 0, topIconColor: '', topIconOpacity: 0,
    // Icon hover URLs
    iconHoverUrls: {}, iconHoverAllUrl: '',
    // Raw mode for imported ST themes
    rawMode: false, _rawStVars: null,
};

function loadSettings() {
    if (extension_settings[EXTENSION_NAME]) settings = { ...DEFAULT_SETTINGS, ...extension_settings[EXTENSION_NAME] };
    else { extension_settings[EXTENSION_NAME] = { ...DEFAULT_SETTINGS }; settings = { ...DEFAULT_SETTINGS }; }
    if (!settings.overrides) settings.overrides = {};
    if (!settings.iconUrls) settings.iconUrls = {};
    if (!settings.customIcons) settings.customIcons = [];
}
function saveSettings() { extension_settings[EXTENSION_NAME] = { ...settings }; saveSettingsDebounced(); }

// =====================
// Top Icon Visibility
// =====================
function applyTopIconVisibility() {
    const show = settings.showTopIcon !== false;
    if (show) { $('#charites_drawer').show(); }
    else {
        if ($('#charites_drawer_icon').hasClass('openIcon')) { $('#charites_drawer_icon').toggleClass('openIcon closedIcon'); $('#charites_drawer_content').toggleClass('openDrawer closedDrawer').hide(); }
        $('#charites_drawer').hide();
    }
}

// =====================
// Preview
// =====================
function applyPreview() {
    if (!settings.previewEnabled) { removePreview(); return; }
    let el = document.getElementById(STYLE_ID);
    if (!el) { el = document.createElement('style'); el.id = STYLE_ID; document.head.appendChild(el); }
    el.textContent = buildThemeCSS(settings);
    _applyTopBarInline(settings);
    const drawer = document.getElementById('charites_drawer');
    drawer?.classList.toggle('cht-light', settings.bright > 50);
    applyParticleEffect();
    applyMouseEffect();
}
function removePreview() {
    document.getElementById(STYLE_ID)?.remove();
    _clearTopBarInline();
    destroyParticleEffect();
    destroyMouseEffect();
}

function _applyTopBarInline(st) {
    const root = document.documentElement;
    // rawMode: override CSS variables that ST sets via JS inline style
    if (st.rawMode && st._rawStVars) {
        const v = st._rawStVars;
        if (v.blurTint) root.style.setProperty('--SmartThemeBlurTintColor', v.blurTint, 'important');
        if (v.chatTint) root.style.setProperty('--SmartThemeChatTintColor', v.chatTint, 'important');
        if (v.userMesTint) root.style.setProperty('--SmartThemeUserMesBlurTintColor', v.userMesTint, 'important');
        if (v.botMesTint) root.style.setProperty('--SmartThemeBotMesBlurTintColor', v.botMesTint, 'important');
        if (v.bodyColor) root.style.setProperty('--SmartThemeBodyColor', v.bodyColor, 'important');
        if (v.emColor) root.style.setProperty('--SmartThemeEmColor', v.emColor, 'important');
        if (v.quoteColor) root.style.setProperty('--SmartThemeQuoteColor', v.quoteColor, 'important');
        if (v.shadowColor) root.style.setProperty('--SmartThemeShadowColor', v.shadowColor, 'important');
        if (v.borderColor) root.style.setProperty('--SmartThemeBorderColor', v.borderColor, 'important');
    }
    const topBar = document.querySelector('#top-bar');
    if (topBar) {
        let bgVal = st.topBarElBgColor;
        if (!bgVal && !st.rawMode) {
            const c = generateColors(st.hue, st.sat, st.bright, st.colorLight);
            bgVal = { ...c, ...st.overrides }.topBarBg;
        }
        if (bgVal) {
            topBar.style.setProperty('background', bgVal, 'important');
            topBar.style.setProperty('backdrop-filter', 'none', 'important');
            topBar.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
            topBar.style.setProperty('box-shadow', 'none', 'important');
        }
    }
    const holder = document.querySelector('#top-settings-holder');
    if (holder) {
        if (st.topBarBgColor && st.topBarBgColor !== 'transparent' && st.topBarBgColor !== 'rgba(0,0,0,0.00)') {
            holder.style.setProperty('background', st.topBarBgColor, 'important');
        } else {
            holder.style.setProperty('background', 'transparent', 'important');
        }
    }
}

const _MANAGED_CSS_VARS = [
    '--SmartThemeBlurTintColor', '--SmartThemeChatTintColor',
    '--SmartThemeUserMesBlurTintColor', '--SmartThemeBotMesBlurTintColor',
    '--SmartThemeBodyColor', '--SmartThemeEmColor',
    '--SmartThemeQuoteColor', '--SmartThemeShadowColor', '--SmartThemeBorderColor',
];

function _clearTopBarInline() {
    const root = document.documentElement;
    for (const v of _MANAGED_CSS_VARS) root.style.removeProperty(v);
    const topBar = document.querySelector('#top-bar');
    if (topBar) {
        for (const p of ['background', 'backdrop-filter', '-webkit-backdrop-filter', 'box-shadow']) topBar.style.removeProperty(p);
    }
    const holder = document.querySelector('#top-settings-holder');
    if (holder) holder.style.removeProperty('background');
}

// =====================
// Particle Effects
// =====================
let pCanvas = null, pCtx = null, pArr = [], pAnim = null;
function applyParticleEffect() {
    destroyParticleEffect();
    if (!settings.particleEffect || settings.particleEffect === 'none') return;
    pCanvas = document.createElement('canvas'); pCanvas.id = 'charites-particles';
    const isBg = settings.particleLayer === 'background';
    pCanvas.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:${isBg ? '1' : '99998'};`;
    document.body.appendChild(pCanvas);
    if (isBg) {
        _ensureBubbleAboveParticles();
    }
    pCtx = pCanvas.getContext('2d');
    const resize = () => { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const count = Math.min(settings.particleCount || 30, 150); pArr = [];
    for (let i = 0; i < count; i++) pArr.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, sz: (settings.particleSize || 5) * (0.4 + Math.random() * 0.8), spd: (settings.particleSpeed || 3) * (0.3 + Math.random()), wind: (Math.random() - 0.5) * 0.8, rot: Math.random() * 360, rotSpd: (Math.random() - 0.5) * 2, op: 0.3 + Math.random() * 0.7 });
    const color = settings.particleColor || '#ffffff', type = settings.particleEffect;
    function animate() {
        if (!pCtx || !pCanvas) return;
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        for (const p of pArr) {
            p.y += p.spd; p.x += p.wind + Math.sin(p.y * 0.008) * 0.6; p.rot += p.rotSpd;
            if (p.y > pCanvas.height + 20) { p.y = -20; p.x = Math.random() * pCanvas.width; }
            if (p.x > pCanvas.width + 20) p.x = -20; if (p.x < -20) p.x = pCanvas.width + 20;
            pCtx.save(); pCtx.translate(p.x, p.y); pCtx.rotate(p.rot * Math.PI / 180); pCtx.globalAlpha = p.op;
            if (type === 'snow') { pCtx.beginPath(); pCtx.arc(0, 0, p.sz, 0, Math.PI * 2); pCtx.fillStyle = color; pCtx.fill(); }
            else if (type === 'petals') { pCtx.beginPath(); pCtx.ellipse(0, 0, p.sz * 1.2, p.sz * 0.6, 0, 0, Math.PI * 2); pCtx.fillStyle = color; pCtx.fill(); }
            else if (type === 'stars') { let r2 = -Math.PI / 2; const step = Math.PI / 5; pCtx.beginPath(); for (let i = 0; i < 5; i++) { pCtx.lineTo(Math.cos(r2) * p.sz, Math.sin(r2) * p.sz); r2 += step; pCtx.lineTo(Math.cos(r2) * p.sz * 0.45, Math.sin(r2) * p.sz * 0.45); r2 += step; } pCtx.closePath(); pCtx.fillStyle = color; pCtx.fill(); }
            pCtx.restore();
        }
        pAnim = requestAnimationFrame(animate);
    }
    animate();
}
function destroyParticleEffect() {
    if (pAnim) cancelAnimationFrame(pAnim); pAnim = null; pArr = [];
    document.getElementById('charites-particles')?.remove(); pCanvas = null; pCtx = null;
    document.getElementById('charites-particle-layer-css')?.remove();
}

const PARTICLE_LAYER_CSS_ID = 'charites-particle-layer-css';
function _ensureBubbleAboveParticles() {
    if (document.getElementById(PARTICLE_LAYER_CSS_ID)) return;
    const s = document.createElement('style'); s.id = PARTICLE_LAYER_CSS_ID;
    s.textContent = `#chat .mes { position: relative; z-index: 2; }
#top-bar { z-index: 3005; }
#form_sheld, #send_form { position: relative; z-index: 2; }
.drawer-content { z-index: 2; }`;
    document.head.appendChild(s);
}

// =====================
// Mouse Effects
// =====================
let mouseActive = false, glowEl = null;
function applyMouseEffect() {
    destroyMouseEffect();
    if (!settings.mouseEffect || settings.mouseEffect === 'none') return;
    mouseActive = true;
    if (settings.mouseEffect === 'trail') document.addEventListener('mousemove', _onTrail);
    else if (settings.mouseEffect === 'ripple') document.addEventListener('click', _onRipple);
    else if (settings.mouseEffect === 'glow') document.addEventListener('mousemove', _onGlow);
}
function _onTrail(e) { if (!mouseActive) return; const el = document.createElement('div'); const sz = settings.mouseEffectSize || 8; el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${settings.mouseEffectColor || '#fff'};pointer-events:none;z-index:99999;opacity:0.8;transition:all 0.5s ease-out;transform:translate(-50%,-50%);`; document.body.appendChild(el); requestAnimationFrame(() => { el.style.opacity = '0'; el.style.transform = 'translate(-50%,-50%) scale(0.1)'; }); setTimeout(() => el.remove(), 500); }
function _onRipple(e) { if (!mouseActive) return; const el = document.createElement('div'); el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border:2px solid ${settings.mouseEffectColor || '#fff'};border-radius:50%;pointer-events:none;z-index:99999;opacity:0.7;transition:all 0.4s ease-out;transform:translate(-50%,-50%);`; document.body.appendChild(el); requestAnimationFrame(() => { el.style.width = '60px'; el.style.height = '60px'; el.style.opacity = '0'; }); setTimeout(() => el.remove(), 400); }
function _onGlow(e) { if (!mouseActive) return; if (!glowEl) { glowEl = document.createElement('div'); glowEl.id = 'charites-glow'; glowEl.style.cssText = `position:fixed;width:140px;height:140px;border-radius:50%;pointer-events:none;z-index:99998;background:radial-gradient(circle,${settings.mouseEffectColor || 'rgba(255,255,255,0.12)'} 0%,transparent 70%);transform:translate(-50%,-50%);transition:left 0.08s,top 0.08s;`; document.body.appendChild(glowEl); } glowEl.style.left = e.clientX + 'px'; glowEl.style.top = e.clientY + 'px'; }
function destroyMouseEffect() { mouseActive = false; document.removeEventListener('mousemove', _onTrail); document.removeEventListener('click', _onRipple); document.removeEventListener('mousemove', _onGlow); document.querySelectorAll('.charites-trail,.charites-ripple').forEach(el => el.remove()); if (glowEl) { glowEl.remove(); glowEl = null; } document.getElementById('charites-glow')?.remove(); }

// =====================
// UI - Tabs, Color System, Controls (same as before)
// =====================
function initTabs() { const d = document.getElementById('charites_drawer'); d.querySelectorAll('.cht-tab').forEach(tab => { tab.addEventListener('click', () => { d.querySelectorAll('.cht-tab').forEach(t => t.classList.remove('active')); d.querySelectorAll('.cht-tab-content').forEach(p => p.classList.remove('active')); tab.classList.add('active'); const panel = d.querySelector(`.cht-tab-content[data-panel="${tab.dataset.tab}"]`); if (panel) panel.classList.add('active'); }); }); }

function initColorSystem() {
    const d = document.getElementById('charites_drawer');
    const hueBar = d.querySelector('#cht-hue-bar'), hueInd = d.querySelector('#cht-hue-ind');
    let hueDrag = false;
    function updateHueInd() { hueInd.style.left = `${(settings.hue / 360) * 100}%`; hueInd.style.background = `hsl(${settings.hue}, 100%, 50%)`; }
    updateHueInd();
    function onHue(e) { const r = hueBar.getBoundingClientRect(); const cx = e.touches ? e.touches[0].clientX : e.clientX; settings.hue = Math.round((Math.max(0, Math.min(r.width, cx - r.left)) / r.width) * 360); settings.overrides = {}; updateHueInd(); onColorChange(); }
    hueBar.addEventListener('mousedown', e => { hueDrag = true; onHue(e); }); hueBar.addEventListener('touchstart', e => { hueDrag = true; onHue(e); }, { passive: true });
    document.addEventListener('mousemove', e => { if (hueDrag) onHue(e); }); document.addEventListener('touchmove', e => { if (hueDrag) onHue(e); }, { passive: true });
    document.addEventListener('mouseup', () => hueDrag = false); document.addEventListener('touchend', () => hueDrag = false);
    const satSl = d.querySelector('#cht-sat'); satSl.value = settings.sat; d.querySelector('#cht-sat-v').textContent = settings.sat;
    satSl.addEventListener('input', function () { settings.sat = +this.value; d.querySelector('#cht-sat-v').textContent = settings.sat; settings.overrides = {}; onColorChange(); });
    const clSl = d.querySelector('#cht-cl'); clSl.value = settings.colorLight; d.querySelector('#cht-cl-v').textContent = settings.colorLight;
    clSl.addEventListener('input', function () { settings.colorLight = +this.value; d.querySelector('#cht-cl-v').textContent = settings.colorLight; settings.overrides = {}; onColorChange(); });
    const briSl = d.querySelector('#cht-bri'); let lastBright = settings.bright; briSl.value = settings.bright; d.querySelector('#cht-bri-v').textContent = settings.bright <= 50 ? '夜' : '日';
    briSl.addEventListener('input', function () { const v = +this.value; if (settings.locked && Object.keys(settings.overrides).length > 0) { if (!confirm('你已微调过颜色，拖动日夜条会重置，确定？')) { this.value = lastBright; return; } settings.overrides = {}; } settings.bright = v; lastBright = v; d.querySelector('#cht-bri-v').textContent = v <= 50 ? '夜' : '日'; onColorChange(); });
    const lockBtn = d.querySelector('#cht-lock-daynight');
    function updateLockUI() { lockBtn.classList.toggle('locked', settings.locked); lockBtn.innerHTML = settings.locked ? '<i class="fa-solid fa-lock"></i>' : '<i class="fa-solid fa-lock-open"></i>'; }
    updateLockUI(); lockBtn.addEventListener('click', () => { settings.locked = !settings.locked; updateLockUI(); saveSettings(); });
    const accInp = d.querySelector('#cht-accent'); accInp.value = settings.accent || '#f59e0b'; d.querySelector('#cht-accent-hex').textContent = accInp.value;
    accInp.addEventListener('input', function () { settings.accent = this.value; d.querySelector('#cht-accent-hex').textContent = this.value; onColorChange(); });
    d.querySelector('#cht-fine-toggle').addEventListener('click', () => { const body = d.querySelector('#cht-fine-body'); const show = body.style.display === 'none'; body.style.display = show ? 'block' : 'none'; if (show) buildFineTune(); });
}

function buildFineTune() {
    const d = document.getElementById('charites_drawer'), body = d.querySelector('#cht-fine-body');
    const base = generateColors(settings.hue, settings.sat, settings.bright, settings.colorLight);
    const merged = { ...base, ...settings.overrides }; if (settings.accent) merged.accent = settings.accent;
    body.innerHTML = FINE_VARS.map(([key, label]) => { const val = merged[key] || '#888888'; const hex = val.startsWith('#') ? val : '#888888'; return `<div class="cht-fine-row"><span>${label}</span><input type="color" class="cht-fine-cpick" data-key="${key}" value="${hex}"><span class="cht-fine-hex">${val}</span></div>`; }).join('');
    body.querySelectorAll('.cht-fine-cpick').forEach(inp => { inp.addEventListener('input', () => { settings.overrides[inp.dataset.key] = inp.value; inp.nextElementSibling.textContent = inp.value; onColorChange(); }); });
}
function updateSwatches() {
    const d = document.getElementById('charites_drawer'), sw = d?.querySelector('#cht-swatches'); if (!sw) return;
    const base = generateColors(settings.hue, settings.sat, settings.bright, settings.colorLight);
    const merged = { ...base, ...settings.overrides }; if (settings.accent) merged.accent = settings.accent;
    const keys = ['primary', 'primaryLight', 'accent', 'mainText', 'italicsText', 'quoteText', 'blurTint', 'chatTint', 'userBubble', 'botBubble', 'sendFormBg', 'topBarBg'];
    sw.innerHTML = keys.map(k => { const v = merged[k] || '#888'; return `<div class="cht-swatch" style="background:${v}" title="${k}: ${v}"></div>`; }).join('');
}
function onColorChange() { updateSwatches(); applyPreview(); saveSettings(); const d = document.getElementById('charites_drawer'), fb = d?.querySelector('#cht-fine-body'); if (fb && fb.style.display !== 'none') { const base = generateColors(settings.hue, settings.sat, settings.bright, settings.colorLight); const m = { ...base, ...settings.overrides }; fb.querySelectorAll('.cht-fine-cpick').forEach(inp => { const k = inp.dataset.key; if (!settings.overrides[k] && m[k]?.startsWith('#')) { inp.value = m[k]; inp.nextElementSibling.textContent = m[k]; } }); } }

function initRangeControls() { const d = document.getElementById('charites_drawer'); d.querySelectorAll('input[type="range"][data-s]').forEach(sl => { const key = sl.dataset.s; if (settings[key] !== undefined) sl.value = settings[key]; const em = sl.closest('.cht-field')?.querySelector('em') || sl.parentElement?.querySelector('em'); if (em) { if (key === 'fontScale') em.textContent = (sl.value / 100).toFixed(1); else if (key === 'lineHeight') em.textContent = (sl.value / 100).toFixed(1); else em.textContent = sl.value; } sl.addEventListener('input', function () { settings[key] = +this.value; if (em) { if (key === 'fontScale') em.textContent = (this.value / 100).toFixed(1); else if (key === 'lineHeight') em.textContent = (this.value / 100).toFixed(1); else em.textContent = this.value; } applyPreview(); saveSettings(); }); }); }
function initTextControls() { const d = document.getElementById('charites_drawer'); d.querySelectorAll('input[type="text"][data-s]').forEach(inp => { const key = inp.dataset.s; if (settings[key]) inp.value = settings[key]; inp.addEventListener('change', function () { settings[key] = this.value.trim(); applyPreview(); saveSettings(); }); }); }
function initCheckboxControls() { const d = document.getElementById('charites_drawer'); d.querySelectorAll('input[type="checkbox"][data-s]').forEach(cb => { const key = cb.dataset.s; cb.checked = !!settings[key]; cb.addEventListener('change', function () { settings[key] = this.checked; applyPreview(); saveSettings(); }); }); }
function initOptionButtons() { const d = document.getElementById('charites_drawer'); d.querySelectorAll('.cht-opt-btn[data-setting]').forEach(btn => { const key = btn.dataset.setting, val = btn.dataset.val; if (settings[key] === val) { btn.closest('.cht-opt-group').querySelectorAll('.cht-opt-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); } btn.addEventListener('click', () => { btn.closest('.cht-opt-group').querySelectorAll('.cht-opt-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); settings[key] = val; if (key === 'avatarShape') { const rSl = d.querySelector('#cht-avatar-radius'); if (val === 'circle') { settings.avatarBorderRadius = 50; rSl.value = 50; } else { settings.avatarBorderRadius = 8; rSl.value = 8; } const em = rSl.closest('.cht-field')?.querySelector('em'); if (em) em.textContent = rSl.value; } applyPreview(); saveSettings(); }); }); }
function initColorInputs() { const d = document.getElementById('charites_drawer'); d.querySelectorAll('input[type="color"][data-s]').forEach(inp => { const key = inp.dataset.s; if (settings[key]) inp.value = settings[key]; const hex = inp.closest('.cht-color-row')?.querySelector('.cht-hex'); if (hex) hex.textContent = inp.value; inp.addEventListener('input', function () { settings[key] = this.value; if (hex) hex.textContent = this.value; applyPreview(); saveSettings(); }); }); }
function initBarColorControls() {
    const d = document.getElementById('charites_drawer');
    d.querySelectorAll('.cht-bar-color').forEach(row => {
        const target = row.dataset.target;
        const cpick = row.querySelector('.cht-bar-cpick');
        const alpha = row.querySelector('.cht-bar-alpha');
        const em = row.querySelector('.cht-bar-alpha-v');
        const parsed = _parseToHexAlpha(settings[target] || '');
        cpick.value = parsed.hex;
        const transparency = 100 - parsed.alpha;
        alpha.value = transparency;
        if (em) em.textContent = transparency;
        function update() {
            const t = +alpha.value;
            if (em) em.textContent = t;
            const realAlpha = 100 - t;
            settings[target] = realAlpha <= 0 ? 'transparent' : _hexAlphaToRgba(cpick.value, realAlpha);
            applyPreview(); saveSettings();
        }
        cpick.addEventListener('input', update);
        alpha.addEventListener('input', update);
    });
}
function initCustomCss() { const d = document.getElementById('charites_drawer'), ta = d.querySelector('#cht-custom-css'); if (settings.customCss) ta.value = settings.customCss; ta.addEventListener('change', function () { settings.customCss = this.value; applyPreview(); saveSettings(); }); }

// =====================
// Icons
// =====================
function renderIconList(container, icons, isRemovable) {
    container.innerHTML = icons.map(icon => { const url = settings.iconUrls[icon.id] || ''; const pvHtml = url ? `<img src="${escHtml(url)}" style="width:100%;height:100%;object-fit:contain;">` : `<i class="${icon.fa}"></i>`; return `<div class="cht-icon-entry" data-icon-id="${icon.id}"><div class="cht-icon-preview" id="cht-ipv-${icon.id}">${pvHtml}</div><span class="cht-icon-name">${escHtml(icon.name)}</span><input type="text" value="${escHtml(url)}" placeholder="图标URL..." data-icon="${icon.id}">${isRemovable ? `<button class="cht-icon-remove" data-remove="${icon.id}" title="移除"><i class="fa-solid fa-xmark"></i></button>` : ''}</div>`; }).join('');
    container.querySelectorAll('input[data-icon]').forEach(inp => { inp.addEventListener('change', function () { const id = this.dataset.icon, url = this.value.trim(); if (url) settings.iconUrls[id] = url; else delete settings.iconUrls[id]; const pv = container.querySelector(`#cht-ipv-${id}`); const icon = [...OLD_TOP_ICONS, ...NEW_TOP_ICONS, ...BOTTOM_ICONS, ...(settings.customIcons || [])].find(i => i.id === id); if (pv) pv.innerHTML = url ? `<img src="${escHtml(url)}" style="width:100%;height:100%;object-fit:contain;">` : `<i class="${icon?.fa || 'fa-solid fa-question'}"></i>`; applyPreview(); saveSettings(); }); });
    if (isRemovable) container.querySelectorAll('[data-remove]').forEach(btn => { btn.addEventListener('click', () => { const id = btn.dataset.remove; settings.customIcons = settings.customIcons.filter(i => i.id !== id); delete settings.iconUrls[id]; renderIconList(container, settings.customIcons, true); applyPreview(); saveSettings(); }); });
}
function initIconControls() {
    const d = document.getElementById('charites_drawer');
    renderIconList(d.querySelector('#cht-icons-new'), NEW_TOP_ICONS, false); renderIconList(d.querySelector('#cht-icons-old'), OLD_TOP_ICONS, false);
    renderIconList(d.querySelector('#cht-icons-bottom'), BOTTOM_ICONS, false); renderIconList(d.querySelector('#cht-icons-custom'), settings.customIcons || [], true);
    d.querySelector('#cht-add-custom-icon').addEventListener('click', () => { const sel = prompt('输入CSS选择器：'); if (!sel) return; const name = prompt('图标名称：') || sel; const id = 'custom_' + Date.now(); settings.customIcons.push({ id, name, selector: sel, fa: 'fa-solid fa-puzzle-piece' }); renderIconList(d.querySelector('#cht-icons-custom'), settings.customIcons, true); saveSettings(); });
}

// =====================
// Smart ST Import - CSS Parser
// =====================
function _parseSTCss(css, s) {
    if (!css) return;
    const imports = css.match(/@import\s+url\(["']([^"']+)["']\)/g);
    if (imports && imports.length > 0) { const m = imports[0].match(/@import\s+url\(["']([^"']+)["']\)/); if (m) s.fontImportUrl = m[1]; }
    const fontFam = css.match(/body[^{]*\{[^}]*font-family:\s*["']?([^"';!}]+)/); if (fontFam) s.fontFamily = fontFam[1].trim();
    if (/\.mes\s*\{[^}]*flex-direction:\s*column[^}]*align-items:\s*center/s.test(css)) s.avatarPosition = 'topCenter';
    else if (/\.mesAvatarWrapper[^{]*\{[^}]*justify-content:\s*flex-start/.test(css)) s.avatarPosition = 'topLeft';
    const avImgSz = css.match(/\.avatar\s+img\s*\{[^}]*width:\s*(\d+)px/); if (avImgSz) s.avatarSize = parseInt(avImgSz[1]);
    const avScale = css.match(/\.avatar\s*\{[^}]*transform:\s*scale\(([\d.]+)\)/); if (avScale) s.avatarSize = Math.round(50 * parseFloat(avScale[1]));
    const frameUrl = css.match(/\.avatar::before\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/); if (frameUrl) s.avatarFrameUrl = frameUrl[1];
    const sendBg = css.match(/#send_form\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/); if (sendBg) s.sendFormBgUrl = sendBg[1];
    const sendR = css.match(/#send_form\s*\{[^}]*border-radius:\s*(\d+)px/); if (sendR) s.sendFormRadius = parseInt(sendR[1]);
    const topBarBg = css.match(/#top-settings-holder\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/); if (topBarBg) s.topBarBgUrl = topBarBg[1];
    // Extract top-settings-holder background color
    const topBarBgColor = css.match(/#top-settings-holder\s*\{[^}]*background(?:-color)?:\s*((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|linear-gradient\([^;]+))\s*[;!]/);
    if (topBarBgColor) s.topBarBgColor = topBarBgColor[1].trim();
    // Extract #top-bar background color (different element)
    const topBarElBg = css.match(/#top-bar\s*\{[^}]*background(?:-color)?:\s*((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|linear-gradient\([^;]+))\s*[;!]/);
    if (topBarElBg) s.topBarElBgColor = topBarElBg[1].trim();
    // Extract send form background color
    const sendFormBgColor = css.match(/#send_form\s*\{[^}]*background(?:-color)?:\s*((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|linear-gradient\([^;]+))\s*[;!]/);
    if (sendFormBgColor) s.sendFormBgColor = sendFormBgColor[1].trim();
    // Extract hover icon URL (all top icons share one hover image)
    const hoverIconAll = css.match(/:hover::before[^{]*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/);
    if (hoverIconAll) { if (!s.iconHoverAllUrl) s.iconHoverAllUrl = hoverIconAll[1]; }
    // Extract chat container/area background
    const chatBg = css.match(/#chat\s*\{[^}]*background(?:-color)?:\s*((?:rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|transparent))/);
    if (chatBg) s.chatContainerBg = chatBg[1].trim();
    const preloaderBg = css.match(/#preloader\s*\{[^}]*background-color:\s*([^;}\s]+)/); if (preloaderBg) s.preloaderBg = preloaderBg[1].trim();
    const preloaderBgImg = css.match(/#preloader\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/); if (preloaderBgImg) s.preloaderBgUrl = preloaderBgImg[1];
    const spinnerImg = css.match(/#load-spinner\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/); if (spinnerImg) s.preloaderImgUrl = spinnerImg[1];
    if (!s.iconUrls) s.iconUrls = {};
    const iconPats = [
        [/#options_button[^{]*::before\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/, 'options_button'],
        [/#extensionsMenuButton[^{]*::before\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/, 'extensionsMenuButton'],
        [/#send_but[^{]*::before\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/, 'send_but'],
        [/#mes_stop[^{]*::before\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/, 'mes_stop'],
        [/#quick-reply-rocket-button[^{]*::before\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/, 'qr_rocket'],
    ];
    for (const [re, id] of iconPats) { const m = css.match(re); if (m) s.iconUrls[id] = m[1]; }
    const topIconAll = css.match(/#top-settings-holder\s+\.drawer-icon::before\s*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/);
    if (topIconAll) { const u = topIconAll[1]; for (const icon of NEW_TOP_ICONS) { if (!s.iconUrls[icon.id]) s.iconUrls[icon.id] = u; } for (const icon of OLD_TOP_ICONS) { if (!s.iconUrls[icon.id]) s.iconUrls[icon.id] = u; } }
    const individualIcons = [
        [/#leftNavDrawerIcon::before[^{]*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/, 'n-completions'],
        [/#rightNavDrawerIcon::before[^{]*\{[^}]*background-image:\s*url\(["']([^"']+)["']\)/, 'n-charcard'],
    ];
    for (const [re, id] of individualIcons) { const m = css.match(re); if (m) s.iconUrls[id] = m[1]; }
    // SAYA-style: icon default color via ::before { color: ... }
    const iconColorM = css.match(/#leftNavDrawerIcon::before[^{]*\{[^}]*[\s;{]color:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
    if (iconColorM && !s.topIconColor) s.topIconColor = iconColorM[1].trim();
}

// =====================
// Theme Management
// =====================
function getSavedThemes() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function setSavedThemes(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
function refreshThemeList() { const sel = document.querySelector('#cht-saved-themes'); if (!sel) return; const themes = getSavedThemes(); sel.innerHTML = themes.length === 0 ? '<option value="">（无保存的主题）</option>' : themes.map((t, i) => `<option value="${i}">${escHtml(t.name || '未命名')} - ${escHtml(t.author || '匿名')}</option>`).join(''); }
function downloadJSON(data, filename) { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
function getExportData() { return { _charites: true, version: VERSION, name: settings.themeName || '未命名', author: settings.themeAuthor || '', settings: { ...settings } }; }
function getSTExportData() {
    const c = generateColors(settings.hue, settings.sat, settings.bright, settings.colorLight); const merged = { ...c, ...settings.overrides };
    const uOp = (settings.userBubbleOpacity ?? 70) / 100, bOp = (settings.botBubbleOpacity ?? 20) / 100;
    return { name: settings.themeName || 'Charites Theme', blur_strength: 5, main_text_color: merged.mainText, italics_text_color: merged.italicsText, underline_text_color: merged.underlineText, quote_text_color: merged.quoteText, blur_tint_color: _hexToRgba(merged.blurTint, 0.85), chat_tint_color: _hexToRgba(merged.chatTint, 0.5), user_mes_blur_tint_color: _hexToRgba(merged.userBubble, uOp), bot_mes_blur_tint_color: _hexToRgba(merged.botBubble, bOp), shadow_color: _hexToRgba(merged.shadow, 0.5), shadow_width: 2, border_color: merged.border, font_scale: (settings.fontScale || 100) / 100, chat_width: settings.chatWidth || 55, custom_css: buildThemeCSS(settings) };
}
function importCharitesTheme(data) { if (!data._charites || !data.settings) return false; Object.assign(settings, { ...DEFAULT_SETTINGS, ...data.settings }); saveSettings(); syncAllToUI(); applyPreview(); return true; }

function importSTTheme(data) {
    if (!data.main_text_color) return false;
    const parseColor = (c) => { if (!c) return null; if (typeof c === 'string' && c.startsWith('#')) return c; const m = String(c).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/); if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join(''); return null; };

    settings._rawStVars = {
        bodyColor: data.main_text_color, emColor: data.italics_text_color,
        quoteColor: data.quote_text_color, underlineColor: data.underline_text_color,
        blurTint: data.blur_tint_color, chatTint: data.chat_tint_color,
        userMesTint: data.user_mes_blur_tint_color, botMesTint: data.bot_mes_blur_tint_color,
        shadowColor: data.shadow_color, borderColor: data.border_color,
    };
    settings.rawMode = true;

    const mainHex = parseColor(data.main_text_color); if (mainHex) settings.overrides.mainText = mainHex;
    const itHex = parseColor(data.italics_text_color); if (itHex) settings.overrides.italicsText = itHex;
    const qHex = parseColor(data.quote_text_color); if (qHex) settings.overrides.quoteText = qHex;
    const ulHex = parseColor(data.underline_text_color); if (ulHex) settings.overrides.underlineText = ulHex;
    const btHex = parseColor(data.blur_tint_color); if (btHex) settings.overrides.blurTint = btHex;
    const ctHex = parseColor(data.chat_tint_color); if (ctHex) settings.overrides.chatTint = ctHex;
    const ubHex = parseColor(data.user_mes_blur_tint_color); if (ubHex) settings.overrides.userBubble = ubHex;
    const bbHex = parseColor(data.bot_mes_blur_tint_color); if (bbHex) settings.overrides.botBubble = bbHex;
    const shHex = parseColor(data.shadow_color); if (shHex) settings.overrides.shadow = shHex;
    if (data.font_scale) settings.fontScale = Math.round(data.font_scale * 100);
    if (data.chat_width) settings.chatWidth = data.chat_width;
    if (data.blur_strength !== undefined) settings.popupBlur = data.blur_strength;
    if (data.noShadows) settings.snippetNoButtonShadow = true;
    if (data.avatar_style === 1) { settings.avatarShape = 'square'; settings.avatarBorderRadius = 4; }
    const uA = String(data.user_mes_blur_tint_color || '').match(/([\d.]+)\s*\)$/); if (uA) settings.userBubbleOpacity = Math.round(parseFloat(uA[1]) * 100);
    const bA = String(data.bot_mes_blur_tint_color || '').match(/([\d.]+)\s*\)$/); if (bA) settings.botBubbleOpacity = Math.round(parseFloat(bA[1]) * 100);

    if (data.custom_css) { _parseSTCss(data.custom_css, settings); settings.customCss = data.custom_css; }
    settings.themeName = data.name || '导入的ST主题';
    saveSettings(); syncAllToUI(); applyPreview(); return true;
}

function getEffectsExportData() {
    return {
        _charites_effects: true, version: VERSION,
        particleEffect: settings.particleEffect, particleLayer: settings.particleLayer, particleCount: settings.particleCount,
        particleSize: settings.particleSize, particleSpeed: settings.particleSpeed, particleColor: settings.particleColor,
        mouseEffect: settings.mouseEffect, mouseEffectColor: settings.mouseEffectColor, mouseEffectSize: settings.mouseEffectSize,
    };
}
function importEffectsData(data) {
    if (!data._charites_effects) return false;
    const keys = ['particleEffect', 'particleLayer', 'particleCount', 'particleSize', 'particleSpeed', 'particleColor', 'mouseEffect', 'mouseEffectColor', 'mouseEffectSize'];
    for (const k of keys) { if (data[k] !== undefined) settings[k] = data[k]; }
    saveSettings(); syncAllToUI(); applyPreview(); return true;
}

function initThemeControls() {
    const d = document.getElementById('charites_drawer'); refreshThemeList();
    const nameInp = d.querySelector('#cht-theme-name'), authInp = d.querySelector('#cht-theme-author');
    if (settings.themeName) nameInp.value = settings.themeName; if (settings.themeAuthor) authInp.value = settings.themeAuthor;
    nameInp.addEventListener('change', () => { settings.themeName = nameInp.value.trim(); saveSettings(); });
    authInp.addEventListener('change', () => { settings.themeAuthor = authInp.value.trim(); saveSettings(); });

    d.querySelector('#cht-save-theme').addEventListener('click', () => { const themes = getSavedThemes(); themes.push(getExportData()); setSavedThemes(themes); refreshThemeList(); toastr.success('主题已保存'); });
    d.querySelector('#cht-load-theme').addEventListener('click', () => { const sel = d.querySelector('#cht-saved-themes'); const idx = +sel.value; const themes = getSavedThemes(); if (!themes[idx]) return toastr.warning('请先选择一个主题'); importCharitesTheme(themes[idx]); toastr.success('主题已加载'); });
    d.querySelector('#cht-delete-theme').addEventListener('click', () => { const sel = d.querySelector('#cht-saved-themes'); const idx = +sel.value; const themes = getSavedThemes(); if (!themes[idx]) return; if (!confirm(`删除「${themes[idx].name || '未命名'}」？`)) return; themes.splice(idx, 1); setSavedThemes(themes); refreshThemeList(); toastr.info('已删除'); });
    d.querySelector('#cht-export-charites').addEventListener('click', () => { downloadJSON(getExportData(), `charites-${settings.themeName || 'theme'}.json`); });
    d.querySelector('#cht-export-st').addEventListener('click', () => { downloadJSON(getSTExportData(), `${settings.themeName || 'charites-st-theme'}.json`); });
    d.querySelector('#cht-import-file').addEventListener('click', () => { d.querySelector('#cht-import-input').click(); });
    d.querySelector('#cht-import-input').addEventListener('change', function () {
        const file = this.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => { try { const data = JSON.parse(e.target.result); if (data._charites_effects) { if (importEffectsData(data)) toastr.success('特效导入成功'); else toastr.error('导入失败'); } else if (data._charites) { if (importCharitesTheme(data)) toastr.success('Charites主题导入成功'); else toastr.error('导入失败'); } else if (data.main_text_color !== undefined) { if (importSTTheme(data)) toastr.success('ST主题导入成功（rawMode已开启，图标/底栏已智能提取）'); else toastr.error('导入失败'); } else { toastr.error('无法识别的主题格式'); } } catch { toastr.error('JSON解析失败'); } };
        reader.readAsText(file); this.value = '';
    });

    const rawBtn = d.querySelector('#cht-raw-mode');
    if (rawBtn) { rawBtn.checked = !!settings.rawMode; rawBtn.addEventListener('change', function () { settings.rawMode = this.checked; applyPreview(); saveSettings(); }); }

    const fxExport = d.querySelector('#cht-export-effects');
    if (fxExport) fxExport.addEventListener('click', () => { downloadJSON(getEffectsExportData(), 'charites-effects.json'); });
    const fxImport = d.querySelector('#cht-import-effects');
    if (fxImport) fxImport.addEventListener('click', () => { d.querySelector('#cht-import-effects-input')?.click(); });
    const fxInput = d.querySelector('#cht-import-effects-input');
    if (fxInput) fxInput.addEventListener('change', function () { const file = this.files?.[0]; if (!file) return; const r = new FileReader(); r.onload = (e) => { try { const data = JSON.parse(e.target.result); if (importEffectsData(data)) toastr.success('特效导入成功'); else toastr.error('不是有效的特效文件'); } catch { toastr.error('JSON解析失败'); } }; r.readAsText(file); this.value = ''; });
}

function initHeaderActions() {
    const d = document.getElementById('charites_drawer');
    const prevBtn = d.querySelector('#cht-toggle-preview'); prevBtn.classList.toggle('active', settings.previewEnabled);
    prevBtn.addEventListener('click', () => { settings.previewEnabled = !settings.previewEnabled; prevBtn.classList.toggle('active', settings.previewEnabled); if (settings.previewEnabled) applyPreview(); else removePreview(); saveSettings(); });
    d.querySelector('#cht-reset-all').addEventListener('click', () => { if (!confirm('重置所有设置到默认值？')) return; Object.assign(settings, { ...DEFAULT_SETTINGS }); saveSettings(); syncAllToUI(); applyPreview(); toastr.info('已重置'); });
}

// =====================
// Sync UI
// =====================
function syncAllToUI() {
    const d = document.getElementById('charites_drawer'); if (!d) return;
    const hueInd = d.querySelector('#cht-hue-ind'); if (hueInd) { hueInd.style.left = `${(settings.hue / 360) * 100}%`; hueInd.style.background = `hsl(${settings.hue}, 100%, 50%)`; }
    const satSl = d.querySelector('#cht-sat'); if (satSl) { satSl.value = settings.sat; d.querySelector('#cht-sat-v').textContent = settings.sat; }
    const clSl = d.querySelector('#cht-cl'); if (clSl) { clSl.value = settings.colorLight; d.querySelector('#cht-cl-v').textContent = settings.colorLight; }
    const briSl = d.querySelector('#cht-bri'); if (briSl) { briSl.value = settings.bright; d.querySelector('#cht-bri-v').textContent = settings.bright <= 50 ? '夜' : '日'; }
    const accInp = d.querySelector('#cht-accent'); if (accInp) { accInp.value = settings.accent || '#f59e0b'; d.querySelector('#cht-accent-hex').textContent = settings.accent || '#f59e0b'; }
    d.querySelectorAll('input[type="range"][data-s]').forEach(sl => { const key = sl.dataset.s; if (settings[key] !== undefined) sl.value = settings[key]; const em = sl.closest('.cht-field')?.querySelector('em') || sl.parentElement?.querySelector('em'); if (em) { if (key === 'fontScale') em.textContent = (sl.value / 100).toFixed(1); else if (key === 'lineHeight') em.textContent = (sl.value / 100).toFixed(1); else em.textContent = sl.value; } });
    d.querySelectorAll('input[type="text"][data-s]').forEach(inp => { const key = inp.dataset.s; inp.value = settings[key] || ''; });
    d.querySelectorAll('input[type="checkbox"][data-s]').forEach(cb => { cb.checked = !!settings[cb.dataset.s]; });
    d.querySelectorAll('input[type="color"][data-s]').forEach(inp => { const key = inp.dataset.s; if (settings[key]) inp.value = settings[key]; const hex = inp.closest('.cht-color-row')?.querySelector('.cht-hex'); if (hex) hex.textContent = inp.value; });
    d.querySelectorAll('.cht-opt-btn[data-setting]').forEach(btn => { btn.classList.toggle('active', settings[btn.dataset.setting] === btn.dataset.val); });
    d.querySelectorAll('.cht-bar-color').forEach(row => {
        const target = row.dataset.target;
        const cpick = row.querySelector('.cht-bar-cpick');
        const alpha = row.querySelector('.cht-bar-alpha');
        const em = row.querySelector('.cht-bar-alpha-v');
        const parsed = _parseToHexAlpha(settings[target] || '');
        const transparency = 100 - parsed.alpha;
        if (cpick) cpick.value = parsed.hex;
        if (alpha) alpha.value = transparency;
        if (em) em.textContent = transparency;
    });
    const ta = d.querySelector('#cht-custom-css'); if (ta) ta.value = settings.customCss || '';
    const nameInp = d.querySelector('#cht-theme-name'); if (nameInp) nameInp.value = settings.themeName || '';
    const authInp = d.querySelector('#cht-theme-author'); if (authInp) authInp.value = settings.themeAuthor || '';
    const rawBtn = d.querySelector('#cht-raw-mode'); if (rawBtn) rawBtn.checked = !!settings.rawMode;
    updateSwatches();
    renderIconList(d.querySelector('#cht-icons-new'), NEW_TOP_ICONS, false); renderIconList(d.querySelector('#cht-icons-old'), OLD_TOP_ICONS, false);
    renderIconList(d.querySelector('#cht-icons-bottom'), BOTTOM_ICONS, false); renderIconList(d.querySelector('#cht-icons-custom'), settings.customIcons || [], true);
    refreshThemeList(); $('#charites-ext-show-top-icon').prop('checked', settings.showTopIcon !== false); applyTopIconVisibility();
}

// =====================
// Drawer Init
// =====================
function openDrawerLegacy() {
    const di = $('#charites_drawer_icon'), dc = $('#charites_drawer_content');
    if (di.hasClass('closedIcon')) {
        $('.openDrawer').not('#charites_drawer_content').not('.pinnedOpen').addClass('resizing').each((_, el) => { slideToggle(el, { ...getSlideToggleOptions(), onAnimationEnd: (e) => e.closest('.drawer-content')?.classList.remove('resizing') }); });
        $('.openIcon').not('#charites_drawer_icon').not('.drawerPinnedOpen').toggleClass('closedIcon openIcon');
        $('.openDrawer').not('#charites_drawer_content').not('.pinnedOpen').toggleClass('closedDrawer openDrawer');
        di.toggleClass('closedIcon openIcon'); dc.toggleClass('closedDrawer openDrawer');
        dc.addClass('resizing').each((_, el) => { slideToggle(el, { ...getSlideToggleOptions(), onAnimationEnd: (e) => e.closest('.drawer-content')?.classList.remove('resizing') }); });
    } else {
        di.toggleClass('openIcon closedIcon'); dc.toggleClass('openDrawer closedDrawer');
        dc.addClass('resizing').each((_, el) => { slideToggle(el, { ...getSlideToggleOptions(), onAnimationEnd: (e) => e.closest('.drawer-content')?.classList.remove('resizing') }); });
    }
}
async function initDrawer() { const toggle = $('#charites_drawer .drawer-toggle'); if (isNewNavbarVersion()) { toggle.on('click', doNavbarIconClick); } else { $('#charites_drawer_content').attr('data-slide-toggle', 'hidden').css('display', 'none'); toggle.on('click', openDrawerLegacy); } }

// =====================
// Main Init
// =====================
jQuery(async () => {
    console.log(`[Charites] 开始加载 v${VERSION}...`);
    await initNavbarFunction(); loadSettings();
    $('#extensions-settings-button').after(await getTemplate('drawer'));
    const extHtml = `<div id="charites-ext-settings" class="inline-drawer" style="margin-top:4px;"><div class="inline-drawer-toggle inline-drawer-header"><b>Charites 美化工坊</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content"><label class="checkbox_label" style="margin:6px 0;"><input type="checkbox" id="charites-ext-show-top-icon" ${settings.showTopIcon !== false ? 'checked' : ''}><span>显示顶部导航栏图标</span></label></div></div>`;
    $('#extensions_settings2').append(extHtml);
    $('#charites-ext-show-top-icon').on('change', function () { settings.showTopIcon = this.checked; saveSettings(); applyTopIconVisibility(); });
    await initDrawer(); initTabs(); initHeaderActions(); initColorSystem(); initRangeControls(); initTextControls(); initCheckboxControls(); initOptionButtons(); initColorInputs(); initBarColorControls(); initCustomCss(); initIconControls(); initThemeControls();
    syncAllToUI(); applyPreview(); applyTopIconVisibility();
    console.log(`[Charites] v${VERSION} 加载完成！`);
});
