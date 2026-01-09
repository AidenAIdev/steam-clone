# Estrategia de Estructura de Carpetas - Steam Clone

## Principio: Organización por Features

Cada feature es **autocontenida** con sus propios componentes, servicios, estilos y tests.

## Estructura Base

```
steam-clone/
├── backend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── games/
│   │   │   ├── cart/
│   │   │   └── admin/
│   │   ├── shared/
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── config/
│   │   └── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── features/
    │   │   ├── auth/
    │   │   ├── games/
    │   │   ├── cart/
    │   │   └── admin/
    │   ├── shared/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── utils/
    │   │   └── styles/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Anatomía de un Feature

Cada feature sigue esta estructura:

### Frontend Feature
```
features/auth/
├── components/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   └── index.js
├── hooks/
│   └── useAuth.js
├── services/
│   └── authService.js
├── pages/
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
└── index.js
```

### Backend Feature
```
features/auth/
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── models/
│   └── User.js
├── services/
│   └── authService.js
└── index.js
```

## Distribución por Grupos

Cada grupo trabaja en su(s) feature(s) asignado(s):

```
Grupo 1 → features/auth/
Grupo 2 → features/games/
Grupo 3 → features/cart/
Grupo 4 → features/admin/
```

## Assets

```
features/games/assets/      # Específicos del feature
shared/assets/              # Logo app, iconos globales
```

## Carpeta Shared

Para código **reutilizable entre features**:

### Frontend Shared
```
shared/
├── components/      # Botones, Cards, Inputs genéricos
├── hooks/           # useLocalStorage, useDebounce
├── utils/           # formatters, validators
├── constants/       # API_URL, ROUTES
└── styles/          # theme, variables CSS
```

### Backend Shared
```
shared/
├── middleware/      # auth, validation, errorHandler
├── utils/           # helpers, formatters
├── config/          # database, env
└── constants/       # status codes, messages
```

## Reglas de Organización

1. **Un feature = una carpeta** en `features/`
2. **Código reutilizable** va en `shared/`
3. **Cada grupo modifica solo su(s) feature(s)**
4. **Evitar dependencias entre features**
5. **No crear carpetas por tipo de archivo** (`/components`, `/services` globales)

## Convenciones de Nombres

### Archivos
```
PascalCase    → Componentes React (LoginForm.jsx)
camelCase     → Services, hooks, utils (authService.js, useAuth.js)
kebab-case    → CSS modules (login-form.module.css)
UPPER_CASE    → Constantes (API_ROUTES.js)
```

### Carpetas
```
lowercase     → features/auth, shared/utils
```

## Exports Centralizados

Cada feature debe tener un `index.js`:

```javascript
// features/auth/index.js
export { LoginForm, RegisterForm } from './components';
export { useAuth } from './hooks';
export { authService } from './services';
export { LoginPage, RegisterPage } from './pages';
```

Uso desde otros archivos:
```javascript
import { LoginForm, useAuth } from '@/features/auth';
```

## Ejemplo: Feature "Games"

```
features/games/
├── components/
│   ├── GameCard.jsx
│   ├── GameGrid.jsx
│   ├── GameFilter.jsx
│   └── index.js
├── hooks/
│   ├── useGames.js
│   └── useGameDetails.js
├── services/
│   └── gamesService.js
├── pages/
│   ├── GamesPage.jsx
│   └── GameDetailPage.jsx
└── index.js
```

## Comunicación entre Features

Para compartir datos entre features, usar:

1. **Context API** (estado global)
2. **LocalStorage/SessionStorage** (persistencia)
3. **API como fuente de verdad** (backend)

**Evitar**: Importaciones directas entre features.

## Shared Components: ¿Cuándo?

Mover un componente a `shared/` cuando:
- ✅ Se usa en **3+ features diferentes**
- ✅ Es completamente **genérico** (Button, Card, Modal)
- ✅ No tiene **lógica de negocio específica**

**Ejemplos válidos en shared:**
- `Button`, `Input`, `Modal`, `Spinner`
- `useDebounce`, `useLocalStorage`
- `formatPrice`, `validateEmail`

## Resolución de Conflictos

Si dos grupos necesitan trabajar en la misma carpeta:

1. **Dividir por sub-features**:
   ```
   features/games/
   ├── catalog/     ← Grupo 2A
   └── details/     ← Grupo 2B
   ```

2. **Coordinarse en el equipo** para editar archivos distintos

3. **Usar branches separadas** y merge frecuente a develop