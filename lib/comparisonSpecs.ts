import { ProductRow } from '@/types/supabase';
import { formatPrice } from './utils';

export interface SpecRow {
  key: string;
  label: string;
  values: Record<number, string | boolean | number | null>; // productId -> value display string
  hasDifference: boolean;
}

export interface SpecGroup {
  groupName: string;
  rows: SpecRow[];
}

// Helper to determine accurate device specs based on title, line, or attributes
function getGadgetSpec(product: ProductRow, specKey: string): string {
  const attrs = (product.attributes as Record<string, unknown>) || {};
  const line = String(attrs.line || '').toLowerCase();
  const title = String(product.title || '').toLowerCase();

  switch (specKey) {
    case 'line': {
      if (line === 'i-one' || title.includes('iluma i series one') || title.includes('iluma i one'))
        return 'IQOS ILUMA i ONE';
      if (line === 'one' || title.includes('iluma one')) return 'IQOS ILUMA ONE';
      if (line === 'i-prime' || title.includes('iluma i prime')) return 'IQOS ILUMA i PRIME';
      if (line === 'prime' || title.includes('iluma prime')) return 'IQOS ILUMA PRIME';
      if (line === 'i-standard' || line === 'i' || title.includes('iluma i')) return 'IQOS ILUMA i';
      return 'IQOS ILUMA Standard';
    }

    case 'formFactor': {
      if (line.includes('one') || title.includes('one')) {
        return 'Моноблок (Все-в-одном)';
      }
      return 'Держатель + Зарядный чехол';
    }

    case 'heatingTech': {
      return 'Индукционный нагрев SMARTCORE INDUCTION SYSTEM™';
    }

    case 'consecutiveSessions': {
      if (line.includes('one') || title.includes('one')) {
        return '20 сессий подряд без подзарядки';
      }
      if (line.startsWith('i-') || line === 'i' || title.includes('iluma i')) {
        return 'До 3 сессий подряд (до 20 от чехла)';
      }
      return '2 сессии подряд (до 20 от чехла)';
    }

    case 'flexPuff': {
      if (line.startsWith('i-') || line === 'i' || title.includes('iluma i')) {
        return 'Да (до 4 дополнительных затяжек)';
      }
      return 'Нет';
    }

    case 'displayScreen': {
      if (
        line === 'i-prime' ||
        line === 'i-standard' ||
        line === 'i' ||
        (title.includes('iluma i') && !title.includes('one'))
      ) {
        return 'Сенсорный экран FlexPuff Display';
      }
      return 'Светодиодный индикатор';
    }

    case 'pauseFunction': {
      if (
        line === 'i-prime' ||
        line === 'i-standard' ||
        line === 'i' ||
        (title.includes('iluma i') && !title.includes('one'))
      ) {
        return 'Да (пауза сессии до 8 минут)';
      }
      return 'Нет';
    }

    case 'chargingTime': {
      if (line.includes('one') || title.includes('one')) {
        return 'Около 90 минут (USB-C)';
      }
      return 'Около 135 минут (полная зарядка чехла)';
    }

    case 'bluetooth': {
      return 'Да (IQOS Web / Mobile App Sync)';
    }

    case 'color': {
      return (attrs.color as string) || 'Стандартный';
    }

    case 'price': {
      return formatPrice(product.price);
    }

    case 'inStock': {
      return product.in_stock ? 'В наличии' : 'Под заказ / Нет в наличии';
    }

    default:
      return '—';
  }
}

// Helper to determine sticks specs
function getSticksSpec(product: ProductRow, specKey: string): string {
  const attrs = (product.attributes as Record<string, unknown>) || {};

  switch (specKey) {
    case 'brand':
      return product.brand || 'TEREA';

    case 'origin': {
      const originMap: Record<string, string> = {
        armenia: 'Армения',
        kazakhstan: 'Казахстан',
        russia: 'Россия',
        japan: 'Япония',
        italy: 'Италия',
        poland: 'Польша',
        indonesia: 'Индонезия',
        europe: 'Европа',
      };
      const orig = String(attrs.origin || '').toLowerCase();
      return originMap[orig] || (attrs.origin as string) || 'Импорт';
    }

    case 'flavors': {
      if (Array.isArray(attrs.flavors)) {
        return attrs.flavors.join(', ');
      }
      return (attrs.flavors as string) || 'Классический';
    }

    case 'strength': {
      return (attrs.strength as string) || 'Средняя';
    }

    case 'hasCapsule': {
      return attrs.hasCapsule ? 'Да (Кнопка / Капсула)' : 'Нет';
    }

    case 'priceBlock': {
      return formatPrice(product.price) + ' / блок';
    }

    case 'pricePack': {
      if (attrs.pricePack) {
        return formatPrice(attrs.pricePack as number) + ' / пачка';
      }
      return formatPrice(Math.round(product.price / 10)) + ' / пачка (расчетная)';
    }

    case 'inStock': {
      return product.in_stock ? 'В наличии' : 'Нет в наличии';
    }

    default:
      return '—';
  }
}

// Helper to determine accessories specs
function getAccessoriesSpec(product: ProductRow, specKey: string): string {
  const attrs = (product.attributes as Record<string, unknown>) || {};

  switch (specKey) {
    case 'type':
      return (attrs.type as string) || (attrs.category as string) || 'Аксессуар';
    case 'compatibility':
      return (attrs.compatibility as string) || 'IQOS ILUMA';
    case 'material':
      return (attrs.material as string) || 'Премиум силикон / металл';
    case 'color':
      return (attrs.color as string) || 'Стандартный';

    case 'price':
      return formatPrice(product.price);
    case 'inStock':
      return product.in_stock ? 'В наличии' : 'Нет в наличии';
    default:
      return '—';
  }
}

export function computeComparisonMatrix(
  products: ProductRow[],
  category: 'gadget' | 'sticks' | 'water' | 'accessories',
): SpecGroup[] {
  if (!products || products.length === 0) return [];

  const productIds = products.map((p) => p.id);

  if (category === 'gadget') {
    const rawGroups = [
      {
        groupName: 'Общие характеристики',
        specs: [
          { key: 'line', label: 'Серия / Линейка' },
          { key: 'formFactor', label: 'Форм-фактор' },
          { key: 'color', label: 'Цвет' },
          { key: 'price', label: 'Стоимость' },
          { key: 'inStock', label: 'Наличие' },
        ],
      },
      {
        groupName: 'Технология и нагрев',
        specs: [
          { key: 'heatingTech', label: 'Технология нагрева' },
          { key: 'consecutiveSessions', label: 'Количество сессий' },
          { key: 'flexPuff', label: 'Система FlexPuff (+затяжки)' },
          { key: 'pauseFunction', label: 'Функция паузы сессии' },
          { key: 'displayScreen', label: 'Дисплей / Индикатор' },
        ],
      },
      {
        groupName: 'Питание и интеграция',
        specs: [
          { key: 'chargingTime', label: 'Время полной зарядки' },
          { key: 'bluetooth', label: 'Подключение Bluetooth' },
        ],
      },
    ];

    return rawGroups.map((group) => {
      const rows: SpecRow[] = group.specs.map((spec) => {
        const values: Record<number, string> = {};
        products.forEach((p) => {
          values[p.id] = getGadgetSpec(p, spec.key);
        });

        // Check if values differ across products
        const firstVal = values[productIds[0]];
        const hasDifference =
          products.length > 1 && products.some((p) => values[p.id] !== firstVal);

        return {
          key: spec.key,
          label: spec.label,
          values,
          hasDifference,
        };
      });

      return {
        groupName: group.groupName,
        rows,
      };
    });
  }

  if (category === 'sticks') {
    const rawGroups = [
      {
        groupName: 'Характеристики стиков',
        specs: [
          { key: 'brand', label: 'Бренд' },
          { key: 'origin', label: 'Страна производства' },
          { key: 'flavors', label: 'Вкус / Ноты' },
          { key: 'strength', label: 'Крепость' },
          { key: 'hasCapsule', label: 'Наличие капсулы' },
          { key: 'priceBlock', label: 'Цена за блок' },
          { key: 'pricePack', label: 'Цена за пачку' },
          { key: 'inStock', label: 'Наличие' },
        ],
      },
    ];

    return rawGroups.map((group) => {
      const rows: SpecRow[] = group.specs.map((spec) => {
        const values: Record<number, string> = {};
        products.forEach((p) => {
          values[p.id] = getSticksSpec(p, spec.key);
        });

        const firstVal = values[productIds[0]];
        const hasDifference =
          products.length > 1 && products.some((p) => values[p.id] !== firstVal);

        return {
          key: spec.key,
          label: spec.label,
          values,
          hasDifference,
        };
      });

      return {
        groupName: group.groupName,
        rows,
      };
    });
  }

  // Fallback for accessories / water / generic
  const rawGroups = [
    {
      groupName: 'Основные характеристики',
      specs: [
        { key: 'type', label: 'Тип товара' },
        { key: 'compatibility', label: 'Совместимость' },
        { key: 'material', label: 'Материал' },
        { key: 'color', label: 'Цвет' },
        { key: 'price', label: 'Цена' },
        { key: 'inStock', label: 'Наличие' },
      ],
    },
  ];

  return rawGroups.map((group) => {
    const rows: SpecRow[] = group.specs.map((spec) => {
      const values: Record<number, string> = {};
      products.forEach((p) => {
        values[p.id] = getAccessoriesSpec(p, spec.key);
      });

      const firstVal = values[productIds[0]];
      const hasDifference = products.length > 1 && products.some((p) => values[p.id] !== firstVal);

      return {
        key: spec.key,
        label: spec.label,
        values,
        hasDifference,
      };
    });

    return {
      groupName: group.groupName,
      rows,
    };
  });
}
