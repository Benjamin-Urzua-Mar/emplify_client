# Guía de estilos y design system — Emplify

Esta guía documenta el lenguaje visual de **Emplify** y las reglas para construir interfaces consistentes. Es la referencia oficial: si un patrón no está aquí, agrégalo antes de usarlo en más de una pantalla.

**Stack:** React 18 · Tailwind CSS 3 · NextUI 2 · Font Awesome 6 · SweetAlert2

| Dónde vive | Qué contiene |
|---|---|
| `tailwind.config.js` | Tokens: colores, tipografías, sombras, ancho máximo y tema NextUI |
| `src/index.css` | Estilos base, clases utilitarias (`.page-container`, `.card`, `.link`) y tema de SweetAlert2 |
| `src/components/ui/` | Componentes del design system (layouts y piezas reutilizables) |
| `src/lib/alerts.js` | Alertas, toasts y confirmaciones estandarizadas |
| `src/lib/format.js` | Formato de precios, fechas, imágenes e iniciales |
| `src/lib/catalogos.js` | Hook `useCatalogo` para cargar catálogos del backend (`/comunas`, `/rubros`) |
| `src/data/` | Datos compartidos: íconos de rubros, `contacto`, `navegacion`, `regiones` |

---

## 1. Marca

- **Nombre:** siempre *Emplify* (con E mayúscula). El nombre anterior *WorkIt* está obsoleto y no debe aparecer.
- **Logotipo:** texto en Poppins Bold, `Empl` en color tinta e `ify` en morado de marca. Úsalo siempre con el componente `<Logo />`; nunca lo escribas a mano.

```jsx
<Logo />                         // Tamaño md, enlaza al inicio
<Logo size="sm" />               // Footer, tarjetas pequeñas
<Logo suffix="Admin" to={null} /> // Panel de administración, sin enlace
```

- **Tono de voz:** cercano, en español de Chile, tuteando al usuario ("Busca", "Inicia sesión", "Tu cuenta"). Mensajes cortos y orientados a la acción.
- **Favicon:** `public/favicon.svg` (E blanca sobre fondo morado).

---

## 2. Color

### 2.1 Paleta de marca (`brand`)

| Token | Hex | Uso |
|---|---|---|
| `brand-50` | `#f6efff` | Fondos de íconos, ítem activo en menús |
| `brand-100` | `#ecdcff` | Fondos suaves |
| `brand-200` | `#d9b9ff` | Bordes en hover, decoraciones |
| `brand-300` | `#c08aff` | Bordes de foco suaves |
| `brand-400` | `#a54dff` | — |
| **`brand-500`** | **`#890bff`** | **Color principal**: botones primarios, enlaces, acentos |
| `brand-600` | `#7715d3` | Hover de primario, barra superior, texto sobre `brand-50` |
| `brand-700` | `#6210ad` | Texto de marca sobre fondos claros de alto contraste |
| `brand-800` | `#4d0d87` | — |
| `brand-900` | `#380a62` | — |

`brand-500` sobre blanco tiene un contraste de ~5,9:1 (cumple WCAG AA para texto normal). El texto blanco sobre `brand-500` y `brand-600` también cumple AA.

### 2.2 Neutros

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#1f1f24` | Títulos (h1–h4) y texto destacado |
| `ink-body` | `#444444` | Texto de párrafo (color base del `body`) |
| `ink-muted` | `#777777` | Texto secundario, descripciones, ayudas |
| `surface` | `#ffffff` | Fondo principal y tarjetas |
| `surface-muted` | `#f7f7f9` | Fondo de páginas internas, pies de tarjeta |
| `default-100/200` (NextUI) | — | Bordes y divisores (`border-default-100`) |

### 2.3 Colores semánticos (NextUI)

| Color | Uso |
|---|---|
| `primary` | Acción principal. **Está mapeado a la paleta `brand`.** |
| `success` | Estados positivos: *Activo*, *Disponible*, *Terminado* |
| `warning` | Pendiente, acciones de precaución (banear), sin guardar |
| `danger` | Acciones destructivas, errores, *Baneado* |
| `default` | Estados neutros |

### 2.4 Reglas

- Usa **siempre tokens**, nunca hex sueltos en el JSX (`text-brand-500`, no `text-[#890bff]`).
- En componentes NextUI usa `color="primary"`. **No uses `color="secondary"`** (existe solo como alias de compatibilidad).
- Los tokens antiguos `Primary`, `Secondary`, `Common`, `SecondCommon`, `PrimaryTransparent` y `Transparent` fueron eliminados. Equivalencias:

| Antes | Ahora |
|---|---|
| `text-Primary` / `bg-Primary` | `text-brand-500` / `bg-brand-500` |
| `bg-Secondary` | `bg-brand-600` |
| `text-Common` | `text-ink-muted` |
| `text-SecondCommon` | `text-ink-body` |
| `color="secondary"` | `color="primary"` |

---

## 3. Tipografía

Fuentes cargadas desde Google Fonts en `index.html`.

| Familia | Clase | Pesos | Uso |
|---|---|---|---|
| **Poppins** | `font-display` | 500, 600, 700 | Títulos, logotipo, encabezados de modales |
| **Roboto** | `font-sans` (por defecto) | 400, 500, 700 | Texto general, formularios, botones |

Los `h1`–`h4` usan `font-display` y color `ink` automáticamente (definido en `src/index.css`).

### Escala

| Rol | Clases |
|---|---|
| Hero (h1 de la home) | `text-4xl sm:text-5xl font-bold` |
| Título de página | `text-2xl sm:text-3xl font-bold` (vía `<PageHeader>`) |
| Título de sección | `text-2xl sm:text-3xl font-bold` (landing) · `text-lg font-semibold` (tarjetas) |
| Subtítulo / lead | `text-lg text-ink-body` |
| Cuerpo | `text-base` (16px) |
| Secundario | `text-sm text-ink-muted` |
| Overline / etiqueta | `text-xs font-semibold uppercase tracking-wider text-ink-muted` |

No uses tamaños arbitrarios (`text-[2.5rem]`, `font-[650]`); usa la escala de Tailwind.

---

## 4. Espaciado y layout

- **Base de 4px** (escala de Tailwind). Valores habituales: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `py-8`/`py-16` en secciones.
- **Contenedor de página:** usa siempre `.page-container` (`max-w-content` = 72rem, padding lateral 16/24/32px según breakpoint). No uses `px-32`, `px-[100px]`, `lg:px-[23rem]`, etc.
- **Breakpoints:** `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280. Diseña *mobile first*; el menú hamburguesa se muestra bajo `md`.
- **Formularios:** grilla `grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5`, en orden de lectura por filas (nunca dos columnas independientes).
- **Áreas privadas:** sidebar de 15rem + contenido (`AccountLayout`); en móvil, la navegación pasa a una fila con scroll horizontal.

---

## 5. Superficies, bordes y sombras

| Elemento | Especificación |
|---|---|
| Tarjeta | `.card` → `rounded-2xl border border-default-100 bg-white shadow-card` |
| Sombra | `shadow-card` (sutil, de dos capas). Evita `shadow-lg`/`shadow-xl` |
| Radios | Tarjetas `rounded-2xl` · inputs/botones: los de NextUI (`rounded-xl` aprox.) · chips/píldoras `rounded-full` · íconos destacados `rounded-xl` o `rounded-full` |
| Divisores | `border-default-100` (`divide-y divide-default-100` en listas) |
| Encabezado/pie de tarjeta | `border-b border-default-100 px-5 py-4` / `border-t bg-surface-muted px-5 py-3` |

---

## 6. Iconografía

- **Font Awesome 6** (`solid` por defecto; `regular` para ojo de contraseña; `brands` para redes sociales).
- Íconos decorativos junto a texto: `startContent` en botones o `mr-1.5` en línea.
- Íconos destacados: contenedor `h-11 w-11 rounded-xl bg-brand-50 text-brand-500`.
- **Botones solo con ícono deben tener `aria-label`** y, si es posible, un `Tooltip`.

---

## 7. Componentes

### 7.1 Botones (NextUI `Button`)

| Jerarquía | Props | Ejemplo |
|---|---|---|
| Primario | `color="primary"` | Guardar cambios, Buscar, Aceptar trabajo |
| Secundario | `variant="bordered"` | Cancelar, Atrás, Enviar mensaje |
| Terciario | `variant="light"` o `variant="flat" color="primary"` | Agregar, Ver más |
| Destructivo | `color="danger" variant="light"` (o sólido solo dentro de confirmaciones) | Eliminar, Rechazar |

Reglas:
- Una sola acción primaria por vista o sección.
- Orden en pies de formulario/modal: secundaria a la izquierda, primaria a la derecha.
- Usa `onPress` (no `onClick`) en componentes NextUI.
- Acciones asíncronas: `isLoading` mientras se espera la respuesta.
- CTA en formularios de autenticación: `size="lg"`.
- Para navegar con apariencia de botón: `<Button as={Link} to="/ruta">`.

### 7.2 Campos de formulario

- Usa `Input`, `Select`, `Textarea` de NextUI con **`variant="bordered"`** y **`labelPlacement="outside"`**.
- Todo campo tiene **label visible** (o `aria-label` si el contexto ya lo explica, p. ej. el buscador).
- Obligatorios: `isRequired`.
- Errores: `isInvalid` + `errorMessage` con un texto que diga cómo corregirlo ("Ingresa un correo válido"). Limpia el error al editar el campo.
- Placeholders como ejemplo, no como etiqueta: `Ej: Av. Alemania 123`.
- Usa `autoComplete` e `inputMode` correctos (`email`, `tel`, `numeric`, `new-password`…).
- Componentes especializados:
  - `<PasswordInput>` — contraseña con botón mostrar/ocultar accesible.
  - `<FileField>` — subida de archivos con nombre del archivo seleccionado.
  - `<UbicacionFields>` — Región → Provincia → Comuna encadenados.
  - `<DatosPersonalesFields>` — bloque completo de datos personales para registros.
- Filtros y ordenamiento: `Select size="sm" variant="bordered"` (no uses un `Input` dentro de un `Dropdown`).
- **Listas largas con búsqueda** (equivalente a select2): `Autocomplete` de NextUI, con `defaultItems`, `selectedKey`, `isLoading` y `listboxProps={{ emptyContent }}`. Úsalo cuando haya más de ~15 opciones (p. ej. comunas). Para pocas opciones usa `Select`.
- **Opciones desde el backend:** carga los catálogos con `useCatalogo("comunas" | "rubros")`. Muestra un placeholder "Cargando…" con `isLoading` y, si falla, `isInvalid` + un mensaje con la acción "Reintentar". Usa el `_id` como `key` y el `nombre` como `textValue`.

### 7.3 Chips de estado

`<Chip size="sm" variant="flat" color="…">` con la tabla semántica de la sección 2.3. Ejemplos: *Disponible* (success), *Pendiente* (warning), *En curso* (primary), *Baneado* (danger).

### 7.4 Layouts (`src/components/ui`)

| Componente | Cuándo usarlo |
|---|---|
| `AuthLayout` | Login (tarjeta centrada), registro (`aside` con información + formulario) y onboarding (`width="lg"`) |
| `AccountLayout` | Áreas privadas de cliente y especialista. Recibe `nav` desde `src/data/navegacion.js`. Ítems sin implementar: `disabled: true` (muestra "Pronto") |
| `PageHeader` | Título + descripción + acciones de cada página interna |
| `SectionCard` | Bloques de contenido con título y acciones opcionales |

### 7.5 Piezas reutilizables

| Componente | Uso |
|---|---|
| `Logo` | Logotipo de marca |
| `EmptyState` | Listas vacías o sin resultados: ícono + título + descripción + acción opcional |
| `StepIndicator` | Formularios por pasos (registro de especialista, perfil inicial) |
| `Rating` | Estrellas de solo lectura o seleccionables (`onChange`) |
| `SocialAuthButtons` | Acceso con Google/Facebook |
| `SearchBar` (`Global/`) | Buscador comuna (`Autocomplete`) + rubro (`Select`), ambos cargados desde el backend |
| `LoginForm` (`Global/`) | Formulario de login de clientes y especialistas |

### 7.6 Tablas

NextUI `Table` con `aria-label` descriptivo, `classNames={{ wrapper: "shadow-card" }}`, `emptyContent` en español, `isLoading` + `Spinner` al cargar y paginación con `Pagination color="primary"` en `bottomContent`.

### 7.7 Modales

NextUI `Modal` (gestiona foco, ESC y scroll). Título con `font-display`. Pie: `Cancelar` (bordered) + acción primaria. No construyas modales con `div` fijos.

---

## 8. Feedback al usuario

Usa siempre los helpers de `src/lib/alerts.js` (los estilos de SweetAlert2 ya están alineados al design system en `index.css`):

| Situación | Helper |
|---|---|
| Confirmación breve tras una acción (guardado, sesión iniciada) | `toast.fire({ icon: "success", title })` |
| Éxito que requiere lectura | `alertSuccess(texto, titulo?)` |
| Error del servidor | `alertError(msg)` — título "Algo salió mal" |
| Falla de red (`catch`) | `alertNetworkError()` |
| Aviso / información | `alertWarning(...)` / `alertInfo(...)` |
| Acción destructiva o irreversible | `await confirmDialog({ title, text, confirmText, danger: true })` |

Reglas:
- Toda petición `fetch` debe tener `try/catch` (o `.catch`) y estado de carga visible.
- No encadenes varios diálogos para una sola acción; prefiere un diálogo con validación (`inputValidator`).
- Verifica `result.isConfirmed`, nunca solo el objeto `result` (siempre es *truthy*).
- Estados de carga: `Skeleton` para formularios, `Spinner` para listas, `isLoading` en botones.

---

## 9. Accesibilidad

- `lang="es"` en el documento.
- Contraste mínimo AA (los tokens de esta guía cumplen).
- Foco visible: NextUI usa `focus` = `brand-500`; enlaces y controles nativos tienen anillo `ring-brand-500`.
- Todo control interactivo es un `button` o `a` real (nada de `span` con `onClick`).
- Botones de ícono con `aria-label`; imágenes decorativas con `alt=""`.
- Regiones dinámicas (resultados, chat) con `aria-live="polite"`.
- Navegación activa marcada con `aria-current="page"`.

---

## 10. Formato de datos

Desde `src/lib/format.js`:

| Función | Ejemplo |
|---|---|
| `formatPrecio(1000000)` | `$1.000.000` |
| `formatFecha("2023-09-21")` | `21 sept 2023` |
| `imageUrl(foto)` | URL pública de una imagen del servidor |
| `hoyISO()` | `aaaa-mm-dd` (para `min` en inputs de fecha) |

Datos de contacto: siempre desde `src/data/contacto.js`. Comunas y rubros: siempre desde el backend con `useCatalogo` (los íconos de cada rubro están en `src/data/rubros.js`, con `iconoRubro(nombre)`). Para mostrar referencias pobladas (`{ _id, nombre }`) usa `nombreDe(valor)`.

---

## 11. Checklist para nuevas pantallas

- [ ] Usa un layout (`AuthLayout`, `AccountLayout` o `Header` + `.page-container` + `Footer`).
- [ ] Solo tokens de color/tipografía de esta guía; sin valores arbitrarios.
- [ ] `color="primary"` en NextUI; una sola acción primaria.
- [ ] Inputs `bordered` + `outside` con label, validación y mensajes de error.
- [ ] Estados de carga, vacío y error cubiertos.
- [ ] Funciona en 360px de ancho sin scroll horizontal.
- [ ] Botones de ícono con `aria-label`; sin `span` clicables.
- [ ] Textos en español, tuteando, y la marca escrita como *Emplify*.
