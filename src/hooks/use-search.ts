import { useCallback } from "react";
import { useCategories, useProducts } from "@/hooks/use-shop";
import { normalizeSl } from "@/lib/text";

/**
 * Returns a memoized search function over the catalog.
 * Matches product name, descriptions, ingredients and category names,
 * ignoring Slovenian diacritics.
 */
export function useSearchCatalog() {
  const products = useProducts();
  const categories = useCategories();

  return useCallback(
    (query: string) => {
      const trimmed = normalizeSl(query).trim();
      if (trimmed === "") return { products, categories };

      const matchingCategoryIds = new Set(
        categories
          .filter((category) => normalizeSl(category.name).includes(trimmed))
          .map((category) => category._id),
      );

      const filteredProducts = products.filter((product) => {
        const haystack = normalizeSl(
          `${product.name} ${product.shortDescription} ${product.description} ${product.ingredients}`,
        );
        return haystack.includes(trimmed) || matchingCategoryIds.has(product.categoryId);
      });

      return { products: filteredProducts, categories };
    },
    [products, categories],
  );
}
