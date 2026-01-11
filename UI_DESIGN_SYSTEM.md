
# 🎨 Guía de Diseño UI - Ecosistema Mister Cuarter

Este documento detalla las especificaciones técnicas para replicar la barra de navegación (Header) y el pie de página (Footer) en nuevas aplicaciones, asegurando la coherencia visual del ecosistema.

---

## 1. Fundamentos de Estilo

### Colores Base (Tailwind CSS)
La interfaz utiliza un tema oscuro profundo ("Deep Space").

*   **Fondo Principal:** `#020617` (Slate 950)
*   **Fondo Paneles/Botones:** `#0f172a` (Slate 900)
*   **Bordes:** `#1e293b` (Slate 800)
*   **Texto Principal:** `#e2e8f0` (Slate 200)
*   **Texto Secundario:** `#64748b` (Slate 500)

### Colores de Marca (Navegación Global)
Cada enlace del ecosistema tiene un color semántico asignado:

*   **WEB (Mister Cuarter):** Cyan (`text-cyan-500`, `border-cyan-500`)
*   **LABORATORIO:** Purple (`text-purple-500`, `border-purple-500`)
*   **NEOGÉNESIS:** Green/Emerald (`text-green-500`, `border-green-500`)
*   **App Actual (Acento):** Variable según la app (ej. Atlas_Core usa Cyan/Accent).

### Tipografía
*   **Texto General:** `Inter` (Sans-serif)
*   **Datos / Títulos Técnicos / Botones:** `JetBrains Mono` (Monospace)

---

## 2. Componente: Header (Encabezado)

El encabezado es `sticky`, tiene desenfoque (`backdrop-blur`) y una línea divisoria inferior.

### Estructura HTML/JSX

```tsx
<header className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-2 sm:py-0 gap-3 sm:gap-0">
    
    {/* SECCIÓN IZQUIERDA: LOGO + NAVEGACIÓN GLOBAL */}
    <div className="flex items-center gap-6">
        
        {/* 1. LOGO DE LA APP (Variable) */}
        <div className="flex items-center gap-3">
             {/* Icono SVG de la App */}
             <svg className="w-8 h-8 text-accent-400" ... /> 
             <h1 className="text-lg font-bold text-white font-mono tracking-tighter hidden sm:block">
                NOMBRE_APP<span className="text-accent-400">_SUFIJO</span>
             </h1>
        </div>
        
        {/* 2. NAVEGACIÓN DEL ECOSISTEMA (Fija) */}
        <nav className="flex gap-2 items-center sm:border-l sm:border-gray-800 sm:pl-6">
             
             {/* WEB BUTTON (Cyan) */}
             <a href="https://mistercuarter.es" target="_blank" className="group relative flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-900 border border-gray-800 hover:border-opacity-100 transition-all overflow-hidden border-cyan-900/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <IconoWeb className="w-3 h-3 text-cyan-500" />
                <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 group-hover:text-cyan-400 transition-colors uppercase">WEB</span>
             </a>
             
             {/* LAB BUTTON (Purple) */}
             <a href="https://mistercuarter.es/laboratoria" target="_blank" className="group relative flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-900 border border-gray-800 hover:border-opacity-100 transition-all overflow-hidden border-purple-900/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] hidden md:flex">
                <IconoLab className="w-3 h-3 text-purple-500" />
                <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 group-hover:text-purple-400 transition-colors uppercase">LAB</span>
             </a>

             {/* NEO BUTTON (Green) */}
             <a href="https://neo.mistercuarter.es" target="_blank" className="group relative flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-900 border border-gray-800 hover:border-opacity-100 transition-all overflow-hidden border-green-900/30 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)] hidden md:flex">
                <IconoNeo className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 group-hover:text-green-400 transition-colors uppercase">NEO</span>
             </a>
        </nav>
    </div>
    
    {/* SECCIÓN DERECHA: ACCIONES DE LA APP */}
    <div className="flex items-center gap-3">
        {/* Botones específicos de la app (Ej: Historial, Login, Idioma) */}
    </div>

  </div>
</header>
```

### Reglas de Diseño del Header
1.  **Botones de Navegación:**
    *   Siempre usan `text-[10px]`, `font-bold`, `font-mono`, `uppercase`.
    *   Fondo: `bg-gray-900`.
    *   Borde inactivo: `border-gray-800` (o color tintado muy sutil).
    *   Hover: El texto y la sombra (`box-shadow`) se iluminan con el color de la marca (Cyan, Purple, Green).
2.  **Logo:**
    *   Debe mantener la estructura `NOMBRE` (Blanco) + `_SUFIJO` (Color Acento de la App).
    *   Fuente: `font-mono tracking-tighter`.

---

## 3. Componente: Footer (Pie de Página)

Minimalista, técnico y anclado visualmente al fondo.

### Estructura HTML/JSX

```tsx
<footer className="border-t border-gray-800 bg-[#06090f] py-8 mt-auto">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      
      {/* CRÉDITOS IZQUIERDA */}
      <div className="text-left space-y-1">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Built with Google AI Studio</p>
          <p className="text-xs font-mono font-bold text-gray-400">Designed by Norberto Cuartero</p>
      </div>

      {/* REDES SOCIALES DERECHA */}
      <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest hidden md:block">SÍGUEME EN</span>
          
          {/* Iconos (X, Insta, LinkedIn, Email) */}
          <a href="..." className="text-gray-500 hover:text-accent-400 transition-colors">
             <IconoX />
          </a>
          {/* ... otros iconos ... */}
      </div>
   </div>
</footer>
```

### Reglas de Diseño del Footer
1.  **Tipografía:** Todo es `font-mono`.
2.  **Jerarquía:**
    *   Etiquetas ("Built with...", "Sígueme en"): `text-[10px]`, `text-gray-500/600`, `uppercase`.
    *   Nombres Propios: `text-xs`, `font-bold`, `text-gray-400`.
3.  **Iconos:**
    *   Estado base: `text-gray-500`.
    *   Hover: Color de la red social o color de acento principal.

---

## 4. Clases de Utilidad (Reusables)

Para mantener la coherencia en los botones del header, puedes crear una clase o componente base:

```css
/* Clase base para botones del Header */
.header-btn {
  @apply group relative flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-900 border border-gray-800 transition-all overflow-hidden;
}

/* Efecto Hover para Web (Cyan) */
.header-btn-web {
  @apply border-cyan-900/30 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)];
}
/* Efecto Hover para Lab (Purple) */
.header-btn-lab {
  @apply border-purple-900/30 hover:border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)];
}
/* Efecto Hover para Neo (Green) */
.header-btn-neo {
  @apply border-green-900/30 hover:border-green-500/50 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)];
}
```
