# ЭТАП 4 — Advanced Math Engine (Desmos-style)

Профессиональный парсер выражений с модульной архитектурой, близкой к поведению графического калькулятора.

## Цель

Пользователь вводит привычную математическую нотацию — график обновляется в реальном времени без сбоев парсера.

## Архитектура

```
math-engine/
├── normalizer.ts   # CRITICAL: shorthands, sin x → sin(x), implicit ×
├── tokenizer.ts    # токенизация + проверка символов
├── parser.ts       # parse + classify (2D / 3D / parametric)
├── evaluator.ts    # validate, compile, debugEvaluate
├── functions.ts    # явный реестр sin, cos, tan, …
├── core/           # типы, константы, ошибки
├── preprocess/     # префиксы уравнений (y=, z=, x=)
├── graph/          # генераторы кривых и поверхностей
│   ├── curve-2d.ts
│   ├── surface-3d.ts
│   └── parametric-2d.ts
├── pipeline.ts     # единая точка входа
├── evaluate.ts     # 2D (+ параметрические пары)
└── evaluate-3d.ts  # 3D поверхности
```

### Поток данных

```
Ввод → preprocess → tokenizer (валидация) → compile (math.js) → graph generator → render
```

## Поддерживаемый синтаксис

### Операции

`+` `-` `*` `/` `^` скобки `()`

### Тригонометрия

`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`

Примеры: `y = sin(x)`, `z = sin(x*y)`

### Константы

`pi`, `e` — также `π`, `\pi`, `e^x` → `exp(x)`

### Функции

`sqrt`, `abs`, `ln` (натуральный), `log` (десятичный, как в Desmos), `exp`, `floor`, `ceil`, `min`, `max`

### Неявное умножение

| Ввод | Нормализация |
|------|----------------|
| `2x` | `2*x` |
| `3sin(x)` | `3*sin(x)` |
| `x(y+1)` | `x*(y+1)` |

### 2D — декартово

- `y = x^2`
- `sin(x)` (без префикса → трактуется как `y = …`)
- `f(x) = …`

### 2D — параметрические

Две строки, общий параметр `t`:

```
x = cos(t)
y = sin(t)
```

Диапазон `t` берётся из видимой области по оси X (`bounds.xMin` … `bounds.xMax`).

### 3D — поверхности

- `z = x^2 + y^2`
- `z = sin(x) + cos(y)`
- `f(x,y) = …`

## Обработка ошибок

- Пустой ввод, неизвестные переменные, недопустимые символы
- Подсказки от math.js через `formatMathError()`
- Параметрические: сообщения о необходимости пары `x = …` / `y = …`

## Math debug mode

Включите кнопку **Bug** на панели инструментов. Для активного выражения отображаются:

- Raw input
- Normalized
- math.js expression
- AST
- `f(test)` — числовой результат

## Исправление trig (критическое)

Плейсхолдеры `__FN0__` ломались правилом `letter*letter` → `__F*N0__`.  
Исправление: Unicode-плейсхолдеры `\uE000` + безопасные правила умножения.

## Сетка координат

**2D:** мелкая + крупная сетка, выделенные оси, маркер (0,0), адаптивный шаг при zoom.  
**3D:** infinite Grid (XZ + XY), подписи осей X / Y / Z.

## API (основное)

```typescript
import {
  preprocess,
  validateExpression,
  compileEquation,
  evaluateAllExpressions,
} from "@/math-engine";

validateExpression("y = 2sin(x)", "2d");
compileEquation("z = x^2 + y^2", "3d");
```

## Расширение

| Задача | Модуль |
|--------|--------|
| LaTeX | `preprocess/shorthand.ts` |
| Полярные координаты | `parser/equation.ts` + `graph/` |
| Неявные F(x,y)=0 | новый `graph/implicit-2d.ts` |
| Больше функций | `core/constants.ts` + `evaluator/scope.ts` |

## Связь с рендером

- **2D:** `evaluate.ts` → `render-engine/draw-curves.ts`
- **3D:** `evaluate-3d.ts` → `render-engine/scene/surface-mesh.tsx`

Math-engine не импортирует UI и render-engine.
