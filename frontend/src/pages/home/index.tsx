import { useState, useEffect } from "react";
import { GetProducts, GetCategories } from "../../services/https";
import { ProductInterface } from "../../interfaces/Product";
import { CategoryInterface } from "../../interfaces/Category";
import { Card, Row, Col, Alert, Empty, Carousel, Rate, Skeleton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import promo from "../../assets/promo.jpg";

// Check if the string is a valid base64
const isBase64 = (str: string) => {
  const base64Regex = /^([A-Za-z0-9+\/=]|\n|\r)+$/;
  return base64Regex.test(str);
};

// Get image URL
const getImageUrl = (image: string | undefined): string => {
  if (!image) return promo;
  if (isBase64(image)) {
    return `data:image/jpeg;base64,${image}`;
  }
  return image.startsWith("http")
    ? image
    : `https://mediam.dotlife.store/media/cata/${image}`;
};

const Homepage = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [startTouch, setStartTouch] = useState(0); // Track starting touch position
  const itemsPerRow = 5;
  const totalItems = categories.length;
  const maxScrollPosition = -(totalItems - itemsPerRow) * 140;
  const navigate = useNavigate();

  const banners = [
    { id: 1, image: promo, title: "Summer Sale", description: "Up to 50% off" },
    {
      id: 2,
      image: promo,
      title: "New Arrivals",
      description: "Check out our latest products",
    },
    {
      id: 3,
      image: promo,
      title: "Free Shipping",
      description: "On orders over ฿1000",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          GetProducts(),
          GetCategories(),
        ]);

        if (productsResponse.status === 200) {
          setProducts(productsResponse.data);
        }

        if (categoriesResponse.status === 200) {
          setCategories(categoriesResponse.data);
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(`Error fetching data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory)
    : products;

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const handleScrollLeft = () => {
    if (scrollPosition < 0) {
      setScrollPosition(scrollPosition + 250);
    }
  };

  const handleScrollRight = () => {
    if (scrollPosition > maxScrollPosition) {
      setScrollPosition(scrollPosition - 250);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartTouch(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchMove = e.touches[0].clientX;
    const diff = startTouch - touchMove;

    if (diff > 50) {
      handleScrollRight(); // Swipe right
    } else if (diff < -50) {
      handleScrollLeft(); // Swipe left
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Alert
          message="Error Loading Products"
          description={error}
          type="error"
          showIcon
          className="max-w-lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-8 shadow-sm overflow-hidden">
          <Carousel autoplay className="h-[400px]">
            {banners.map((banner) => (
              <div key={banner.id}>
                <div className="relative h-[400px]">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h2 className="text-4xl font-bold mb-2">{banner.title}</h2>
                    <p className="text-xl">{banner.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Card>

        <Card className="mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
          <Skeleton loading={loading} active>
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <div className="flex space-x-0 overflow-hidden">
                <div
                  className="flex space-x-0"
                  style={{
                    transform: `translateX(${scrollPosition}px)`,
                    transition: "transform 0.3s ease",
                  }}
                >
                  {categories.slice(0, 20).map((category) => (
                    <div
                      key={category.ID}
                      onClick={() => handleCategoryClick(category.ID || 0)}
                      className="flex flex-col items-center p-2 bg-white hover:shadow-xl transform hover:scale-105 transition-all w-32 border border-gray-200 flex-shrink-0 cursor-pointer"
                    >
                      <div className="h-24 w-24 mb-2 overflow-hidden rounded-full border-2 border-gray-200">
                        <img
                          src={getImageUrl(category.category_picture || "")}
                          alt={`${category.category_name} Category`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-sm font-normal text-gray-800 text-center">
                        {category.category_name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleScrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
              >
                <LeftOutlined />
              </button>
              <button
                onClick={handleScrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2"
              >
                <RightOutlined />
              </button>
            </div>
          </Skeleton>
        </Card>

        <Card className="shadow-lg rounded-lg overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <span className="text-gray-500">
              {filteredProducts.length} products found
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredProducts.map((product) => {
                const averageRating = product.reviews?.length
                  ? product.reviews.reduce(
                    (sum, review) => sum + (review.rating || 0),
                    0
                  ) / product.reviews.length
                  : 0;

                return (
                  <Col xs={24} sm={12} md={8} lg={4} key={product.ID}>
                    <Skeleton loading={loading} active>
                      <Card
                        hoverable
                        className="flex flex-col h-full group shadow-lg border rounded-lg transition-transform transform hover:scale-105"
                        cover={
                          <div className="relative pt-[100%] bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              alt={product.product_name}
                              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                              src={getImageUrl(
                                product.product_images?.[0]?.image || ""
                              )}
                              loading="lazy"
                            />
                          </div>
                        }
                        onClick={() => navigate(`/products/${product.ID}`)}
                      >
                        <Card.Meta
                          title={
                            <h3 className="text-sm font-normal text-gray-900 truncate">
                              {product.product_name}
                            </h3>
                          }
                        />
                        <div className="flex justify-between items-center mt-4 space-x-2">
                          <div className="flex items-center space-x-1">
                            <Rate
                              disabled
                              value={averageRating}
                              count={1}
                              className="text-xs"
                            />
                            <span className="text-xs text-gray-500">
                              {averageRating.toFixed(1)} (
                              {product.reviews?.length || 0})
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-gray-900">
                            ฿{product.price}
                          </span>
                        </div>
                      </Card>
                    </Skeleton>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty description="No products found" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Homepage;
