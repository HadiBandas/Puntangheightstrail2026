# Puntang Height Trail 2026 🏔️🏃‍♂️

Official landing page for **Puntang Height Trail 2026**, an exclusive 200-slot trail running event located at Mount Puntang, Bandung. This application is built to showcase the event details, course profiles, and facilitate registration via WhatsApp integration.

![Project Banner](![Banner](https://raw.githubusercontent.com/HadiBandas/Puntangheightstrail2026/main/View.webp)

## 🌟 Features

*   **Immersive UI/UX**: Smooth parallax scrolling, scroll-triggered animations, and a premium dark-themed aesthetic inspired by nature.
*   **Interactive Course Profile**: Custom SVG-based elevation charts that allow users to inspect terrain types (Runnable, Technical, Steep) and view landmarks along the route.
*   **Bilingual Support (i18n)**: Full support for English and Indonesian languages with instant switching.
*   **Family Registration Logic**: Dynamic form handling for individual runners and families (automatically enforcing 5K category restrictions for children).
*   **WhatsApp Integration**: Generates pre-filled WhatsApp messages for registration and payment confirmation.
*   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.

## 🛠️ Tech Stack

*   **Framework**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Build Tool**: [Vite](https://vitejs.dev/)

## 📂 Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── sections/    # Major landing page sections (Hero, Course, etc.)
│   │   ├── ui/          # Reusable UI components (Button, Modal, Card)
│   │   └── ...
│   ├── constants/       # Static data, icons, translations, assets
│   ├── contexts/        # React Contexts (Language, UI, Toast)
│   ├── hooks/           # Custom hooks (useScrollAnimation, useTranslation)
│   ├── types.ts         # TypeScript interfaces
│   ├── App.tsx          # Main application layout
│   └── index.tsx        # Entry point
├── index.html
└── metadata.json
```

## 🚀 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## 🎨 Color Palette

*   **Mountain Slate** (`#022c22`): Primary brand color (Deep Jungle Green).
*   **Trail Orange** (`#f97316`): Action/CTA color.
*   **Summit Gold** (`#fbbf24`): Accent color for achievements.
*   **Forest Green** (`#166534`): Secondary nature tone.

## 👤 Author

**Mahasin Hadiyatulloh**
*   Project Manager & Creator

---

*Reach Your Peak - Find Your Peace*
