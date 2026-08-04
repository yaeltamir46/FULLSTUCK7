import Button from "../common/Button";
import Input from "../common/Input";

function ProductFilters({
  filters,
  categories,
  onChange,
  onReset,
}) {
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    onChange({
      ...filters,
      [name]:
        type === "checkbox"
          ? checked
            ? true
            : ""
          : value,
    });
  }

  return (
    <section aria-labelledby="product-filters-title">
      <h2 id="product-filters-title">Filter products</h2>

      <Input
        id="search"
        label="Search"
        type="search"
        placeholder="Search by product name"
        value={filters.search}
        onChange={handleChange}
      />

      <div>
        <label htmlFor="categoryId">Category</label>

        <select
          id="categoryId"
          name="categoryId"
          value={filters.categoryId}
          onChange={handleChange}
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="minPrice"
        label="Minimum price"
        type="number"
        min="0"
        step="0.01"
        value={filters.minPrice}
        onChange={handleChange}
      />

      <Input
        id="maxPrice"
        label="Maximum price"
        type="number"
        min="0"
        step="0.01"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <div>
        <label>
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock === true}
            onChange={handleChange}
          />
          In-stock products only
        </label>
      </div>

      <div>
        <label htmlFor="sort">Sort by</label>

        <select
          id="sort"
          name="sort"
          value={filters.sort}
          onChange={handleChange}
        >
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
          <option value="nameAsc">Name: A to Z</option>
        </select>
      </div>

      <Button type="button" onClick={onReset}>
        Reset filters
      </Button>
    </section>
  );
}

export default ProductFilters;