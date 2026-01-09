# Estrategia de Ramificación Git - Steam Clone

## Ramas Principales

- **`main`**: Código en producción
- **`develop`**: Integración de trabajo de todos los grupos

## Nomenclatura de Ramas

```
feature/g{número-grupo}/{descripción}
```

**Ejemplos:**
```bash
feature/g1/login-system
feature/g2/game-catalog
feature/g3/shopping-cart
feature/g4/admin-panel
```

## Flujo de Trabajo

```bash
# 1. Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/g1/nombre-feature

# 2. Desarrollar y commitear
git add .
git commit -m "feat(g1): descripción del cambio"
git push origin feature/g1/nombre-feature

# 3. Crear Pull Request hacia develop
# 4. Después del merge, eliminar la rama
git branch -d feature/g1/nombre-feature
```

## Convenciones de Commits

```bash
feat(g#): nuevo feature
fix(g#): corrección de bug
docs(g#): documentación
style(g#): formato de código
refactor(g#): refactorización
test(g#): tests
```

## Reglas

1. Nunca commit directo a `main` o `develop`
2. Siempre pull de `develop` antes de crear rama
3. Usar commits descriptivos con prefijo `(g#)`
4. Probar código localmente antes de push
5. Resolver conflictos antes de crear PR

## Comandos Útiles

```bash
# Ver estado
git status

# Ver ramas
git branch -a

# Actualizar rama con develop
git checkout feature/g1/mi-feature
git merge origin/develop

# Eliminar rama
git branch -d feature/g1/mi-feature
git push origin --delete feature/g1/mi-feature
```
