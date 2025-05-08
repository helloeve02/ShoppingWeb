import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductInterface } from "../../../interfaces/Product";
import { GetProducts } from "../../../services/https/index";
import { Card, Button, Spin, Empty, message } from "antd";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder.jpg";

interface SortConfig {
  key: "price";
  direction: "asc" | "desc";
}

const SearchProduct: React.FC = () => {
  const { searchQuery, categoryId } = useParams<{
    searchQuery?: string;
    categoryId?: string;
  }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (searchQuery) {
          response = await GetProducts();
        } else {
          response = await GetProducts();
        }

        if (!response?.data) {
          throw new Error("No data received from server");
        }

        setProducts(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch products";
        setError(errorMessage);
        message.error("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryId]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products.length) return [];

    let result = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.product_name?.toLowerCase().includes(query)
      );
    }

    if (categoryId) {
      result = result.filter(
        (product) => product.category_id?.toString() === categoryId
      );
    }

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const priceA = a.price ?? 0;
        const priceB = b.price ?? 0;
        return sortConfig.direction === "asc"
          ? priceA - priceB
          : priceB - priceA;
      });
    }

    return result;
  }, [products, searchQuery, categoryId, sortConfig]);

  const handleSort = (direction: "asc" | "desc") => {
    setSortConfig({ key: "price", direction });
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-semibold text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!filteredAndSortedProducts.length) {
    return (
      <Empty
        description={
          searchQuery
            ? `No products found for "${searchQuery}"`
            : categoryId
              ? `No products found in this category`
              : "No products available"
        }
        className="py-12"
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {searchQuery
            ? `Search Results for: ${searchQuery}`
            : categoryId
              ? `Products in Category: ${categoryId}`
              : "All Products"}
        </h1>

        <div className="flex gap-4">
          <Button
            onClick={() => handleSort("asc")}
            icon={<ChevronUp />}
            className={`${sortConfig?.direction === "asc" ? "bg-blue-500 text-white" : "bg-white"
              } px-6 py-2 text-sm rounded-md border border-gray-300 transition-colors duration-200 hover:bg-blue-600 hover:text-white flex items-center shadow-md`}
          >
            Low to High
          </Button>
          <Button
            onClick={() => handleSort("desc")}
            icon={<ChevronDown />}
            className={`${sortConfig?.direction === "desc" ? "bg-blue-500 text-white" : "bg-white"
              } px-6 py-2 text-sm rounded-md border border-gray-300 transition-colors duration-200 hover:bg-blue-600 hover:text-white flex items-center shadow-md`}
          >
            High to Low
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <Card
            key={product.ID}
            className="hover:shadow-xl transition-shadow duration-300"
            onClick={() => handleProductClick(product.ID || 0)}
            hoverable
          >
            <div className="relative pb-[75%]">
              <img
                src={product.product_images?.[0]?.image || PLACEHOLDER_IMAGE}
                alt={product.product_name}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                loading="lazy"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 truncate">
                {product.product_name}
              </h3>

              <div className="space-y-2">
                <p className="text-orange-600 text-xl font-semibold">
                  ฿{(product.price ?? 0).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">
                  Stock: {product.stock} units
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchProduct;
