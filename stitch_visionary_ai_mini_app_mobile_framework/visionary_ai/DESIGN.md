---
name: Visionary AI
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#58423a'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#8b7268'
  outline-variant: '#dfc0b5'
  surface-tint: '#a53c01'
  primary: '#a13a00'
  on-primary: '#ffffff'
  primary-container: '#c3511a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb598'
  secondary: '#632ce5'
  on-secondary: '#ffffff'
  secondary-container: '#7c4dff'
  on-secondary-container: '#fcf6ff'
  tertiary: '#92471d'
  on-tertiary: '#ffffff'
  tertiary-container: '#b15e33'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb598'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7e2c00'
  secondary-fixed: '#e8deff'
  secondary-fixed-dim: '#cdbdff'
  on-secondary-fixed: '#20005f'
  on-secondary-fixed-variant: '#4f00d0'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#773208'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  label-bold:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  safe_area_bottom: env(safe-area-inset-bottom)
---

## Brand & Style

The design system is engineered for a high-end AI assistant within the WeChat ecosystem. It balances the warmth of human-centric design with the precision of advanced machine learning. The target audience consists of forward-thinking creators and professionals who require a tool that feels both approachable and technologically superior.

The visual style is **Soft-Tech Glassmorphism**. It utilizes translucent layers, organic motion, and a light-drenched color palette to create an interface that feels airy and unobtrusive. The emotional response is one of clarity, inspiration, and effortless intelligence.

## Colors

The palette is anchored by **Coral Orange**, a vibrant, energetic primary that signals creativity and action. This is contrasted by **Master Mode Violet**, reserved for high-intelligence states and premium AI features. 

The background uses **Minimalist Gray**, a nearly-white neutral that reduces eye strain and provides a sophisticated canvas for glassmorphic elements. Secondary text is rendered in a muted graphite to maintain a clear visual hierarchy without sacrificing legibility.

## Typography

This design system uses **Plus Jakarta Sans** for headings to provide a modern, rounded, and welcoming personality. **Be Vietnam Pro** is utilized for body copy and labels, chosen for its exceptional readability in mobile environments and contemporary feel.

Type scales are optimized for mobile viewing. Bold weights are used sparingly to highlight AI-generated insights and key calls to action. High-contrast ratios are maintained between primary text and the glassmorphic backgrounds to ensure accessibility.

## Layout & Spacing

The layout follows a **fluid-margin model** optimized for the WeChat Mini Program viewport. A standard 16px lateral margin is maintained for content containers, while internal card padding is set to 20px to match the corner radius.

Vertical rhythm is driven by a 4px baseline grid. Special attention is given to the bottom of the screen, where `safe-area-inset-bottom` is mandatory for all fixed-position navigation or action bars to ensure compatibility with modern iPhone gestures.

## Elevation & Depth

Hierarchy is achieved through **Glassmorphism** and subtle ambient shadows rather than traditional drop shadows. 

1.  **Base Layer:** The Minimalist Gray background.
2.  **Surface Layer:** Cards and containers use a semi-transparent white (`rgba(255, 255, 255, 0.7)`) with a `backdrop-filter: blur(20px)` and a 1px solid white border at 10% opacity.
3.  **Elevation Shadow:** A very soft `0 4px 24px rgba(0, 0, 0, 0.04)` is applied to cards to lift them gently from the background.
4.  **Active States:** Elements being interacted with may utilize the Primary Glow (`rgba(230, 107, 51, 0.2)`) to indicate focus.

## Shapes

The design system utilizes a generous **20px radius** for all primary containers and cards, creating a friendly and modern aesthetic that aligns with WeChat’s native components. Buttons use a slightly tighter **16px radius** to provide a distinct functional appearance while maintaining the overall soft visual language.

## Components

### Buttons
- **.btn-primary**: Coral orange background, white bold text. Use an elastic transform (`scale(0.96)`) on active state.
- **.btn-secondary**: Light gray background with dark text; provides a subtle alternative for secondary actions.

### AI Visual Effects
- **.ai-enhancing-border**: A container with a linear gradient animation shifting through Coral Orange and light flesh tones (#e66b33, #ff9d6c, #ffd0b5, #e66b33). The animation should be a 2s continuous loop.
- **.thinking-orb**: A violet radial gradient that pulses in scale and opacity every 3s to indicate the AI is processing information.
- **.neural-particle**: Fine, floating text-based particles used as background decoration for the "Master Mode."
- **.glass-badge**: A semi-transparent label with `backdrop-filter` and a fine 0.5px border for categorizing AI outputs.

### Input & Interaction
- Input fields should use the same glassmorphism treatment as cards but with a 1px border that shifts to Coral Orange on focus. 
- Ensure all fixed bottom elements include `padding-bottom: env(safe-area-inset-bottom)` to prevent overlap with the Home Indicator.