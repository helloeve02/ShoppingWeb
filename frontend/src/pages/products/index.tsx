import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FavoriteToggle,
  GetProductByID,
  ListReviewProducts,
  CreateCart,
} from "../../services/https";
import {
  Minus,
  Plus,
  Share2,
  Heart,
  Info,
  Truck,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, message } from "antd";
import { ReviewInterface } from "../../interfaces/IReview";
import { ProductInterface } from "../../interfaces/Product";
import { CartitemInterface } from "../../interfaces/IOrder";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productData, setProductData] = useState<ProductInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<ReviewInterface[]>(
    []
  );
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userLikes, setUserLikes] = useState(new Set());
  const userId = Number(localStorage.getItem("id")) as number;
  const navigate = useNavigate();
  // const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // const toggleSelectItem = (itemId: number) => {
  //   setSelectedItems(prev => {
  //     const next = new Set(prev);
  //     if (next.has(itemId)) {
  //       next.delete(itemId);
  //     } else {
  //       next.add(itemId);
  //     }
  //     return next;
  //   });
  // };

  const isBase64Image = (image: string) =>
    image.startsWith("data:image/") && !image.includes("://");

  // Handle image navigation (previous/next)
  const handleImageNavigation = (direction: "prev" | "next") => {
    const totalImages = productData!.product_images!.length; // Assert that product_images is not null/undefined

    setCurrentImageIndex((prevIndex) => {
      let newIndex: number = prevIndex;

      if (direction === "prev") {
        newIndex = prevIndex === 0 ? totalImages - 1 : prevIndex - 1;
      } else if (direction === "next") {
        newIndex = prevIndex === totalImages - 1 ? 0 : prevIndex + 1;
      }

      setSelectedImage(productData!.product_images![newIndex]?.image ?? "");

      return newIndex;
    });
  };

  // Effect to handle user likes and favorites
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setUserLikes(new Set(storedFavorites));
  }, []);

  // Fetch product data and reviews
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const response = await GetProductByID(productId);
        if (response && response.data) {
          setProductData(response.data);
          if (response.data.product_images?.length > 0) {
            setSelectedImage(response.data.product_images[0].image);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product data", error);
      } finally {
        setLoading(false);
      }

      try {
        const reviewedResponse = await ListReviewProducts(productId);
        const filteredReviews = reviewedResponse.data.filter(
          (review: ReviewInterface) => review.product_id === Number(productId)
        );

        setReviewedProducts(filteredReviews);

        // Calculate average rating and total reviews
        const totalRating = filteredReviews.reduce(
          (acc: number, review: ReviewInterface) => acc + (review.rating ?? 0),
          0
        );

        const reviewCount = filteredReviews.length;

        setAverageRating(
          reviewCount > 0
            ? parseFloat((totalRating / reviewCount).toFixed(1))
            : 0
        );

        setTotalReviews(reviewCount);
      } catch (error) {
      }
    };

    fetchProductData();
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // If product data is not found
  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Product not found</div>
      </div>
    );
  }

  // Discount check
  const hasDiscount =
    productData.promotions && productData.promotions.length > 0;

  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, productData.stock || 0));
    setQuantity(newQuantity);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (
    productId: number,
    reviewId: number,
    userId: number
  ) => {
    try {
      const action = userLikes.has(reviewId) ? "unfavorite" : "favorite";

      const response = await FavoriteToggle(
        productId,
        reviewId,
        userId,
        action
      );
      if (response?.success) {
        setUserLikes((prevLikes) => {
          const updatedLikes = new Set(prevLikes);
          action === "favorite"
            ? updatedLikes.add(reviewId)
            : updatedLikes.delete(reviewId);
          localStorage.setItem("favorites", JSON.stringify([...updatedLikes]));
          return updatedLikes;
        });

        setReviewedProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.product_id === productId
              ? {
                ...product,
                favorites_count: response.favorites_count,
                isFavorited: action === "favorite",
              }
              : product
          )
        );
      } else {
        message.error("Failed to toggle favorite.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      // Check if product data is missing or stock is less than or equal to 0
      if (!productData || (productData.stock ?? 0) <= 0) {
        message.error("Product is out of stock or data is missing");
        return;
      }

      if (!productId) {
        message.error("Product ID is missing");
        return;
      }

      const cartItemData: CartitemInterface = {
        UserID: userId,
        ProductID: Number(productId),
        Quantity: quantity,
      };

      const response = await CreateCart(cartItemData);

      if (
        response?.data?.message === "Cart item created successfully" ||
        response?.data?.message === "Cart updated successfully"
      ) {
        message.success("Item added to cart successfully");
        window.location.reload();
      } else {
        message.error("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("An error occurred. Please try again.");
    }
  };

  // const handleBuynow = async () => {

  // };



  const handleClick = (product: ReviewInterface) => {
    const { product_id: productId, ID: reviewId } = product;
    if (productId !== undefined && reviewId !== undefined) {
      handleFavoriteToggle(productId, reviewId, userId);
    }
  };

  const images = productData.product_images?.map((img) => img.image) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <a href="/home" className="hover:text-blue-500">
            Home
          </a>
          <span>/</span>
          <span className="text-gray-900">{productData.product_name}</span>
        </nav>

        <Card className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 relative">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={
                    isBase64Image(selectedImage)
                      ? selectedImage
                      : selectedImage.replace("data:image/jpeg;base64,", "")
                  }
                  alt={productData.product_name || "Product Image"}
                  className="w-full h-full object-cover"
                />

                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Sale
                  </div>
                )}
                <button
                  aria-label="Previous Image"
                  className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 focus:outline-none ${currentImageIndex === 0 ||
                    !productData?.product_images?.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                  onClick={() => handleImageNavigation("prev")}
                  disabled={
                    currentImageIndex === 0 ||
                    !productData?.product_images?.length
                  } // Disable if on the first image or no images
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  aria-label="Next Image"
                  className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 focus:outline-none ${currentImageIndex ===
                    (productData?.product_images?.length ?? 0) - 1 ||
                    !productData?.product_images?.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                  onClick={() => handleImageNavigation("next")}
                  disabled={
                    currentImageIndex ===
                    (productData?.product_images?.length ?? 0) - 1 ||
                    !productData?.product_images?.length
                  }
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <button
                  aria-label="Next Image"
                  className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 focus:outline-none ${currentImageIndex ===
                    (productData?.product_images?.length ?? 0) - 1 ||
                    !productData?.product_images?.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                    }`}
                  onClick={() => handleImageNavigation("next")}
                  disabled={
                    currentImageIndex ===
                    (productData?.product_images?.length ?? 0) - 1 ||
                    !productData?.product_images?.length
                  }
                  role="button"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all transform hover:scale-105 ${selectedImage === img
                      ? "border-red-500 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    <img
                      src={
                        isBase64Image(img)
                          ? img
                          : img.replace("data:image/jpeg;base64,", "")
                      }
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
                  {productData.product_name}
                </h1>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex items-center gap-6">
                    <span className="text-4xl font-bold text-red-500">
                      ฿
                      {productData.price
                        ? productData.price.toLocaleString()
                        : "0.00"}
                    </span>

                    {hasDiscount && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          ฿
                          {(productData?.price
                            ? productData.price * 1.2
                            : 0
                          )?.toLocaleString() || "0.00"}
                        </span>

                        <span className="text-red-500 text-lg font-medium">
                          -20%
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {(productData?.stock ?? 0) > 0
                        ? `${productData?.stock} pieces available`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p
                    className={`text-gray-600 ${!isDescriptionExpanded && "line-clamp-3"
                      }`}
                  >
                    {productData.description}
                  </p>
                  {(productData.description ?? "").length > 150 && (
                    <button
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                      className="text-blue-500 text-sm hover:underline"
                    >
                      {isDescriptionExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(Number(e.target.value))
                      }
                      className="w-16 text-center border-x py-2"
                      min="1"
                      max={productData.stock}
                    />
                    <button
                      className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (productData.stock ?? 0)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-6 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-3 border-2 border-red-500 text-red-500 py-3 px-4 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      const price = productData.price || 0; // ตั้งค่าดีฟอลต์เป็น 0 หาก price เป็น undefined
                      navigate("/orderes", {
                        state: {
                          productId: productData.ID,
                          productName: productData.product_name,
                          quantity: quantity,
                          totalPrice: price * quantity,
                        },
                      });
                    }}
                    className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Buy Now
                  </button>



                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping for orders over ฿1,000</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <Heart className="w-5 h-5" />
                      Add to Wishlist
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6 mt-10">
          <h2 className="text-2xl font-semibold">Product Ratings</h2>
          <div>
            <span className="text-5xl font-bold text-red-500">
              {averageRating || "0.0"}
            </span>
            <span className="text-gray-600 text-lg"> out of 5</span>
          </div>

          {/* Stars for Average Rating */}
          <div className="flex space-x-1 mt-2">
            {Array(5)
              .fill(null)
              .map((_, index) => {
                const fullStars = Math.floor(averageRating);
                const hasHalfStar = averageRating - fullStars >= 0.5;

                if (index < fullStars) {
                  return <span key={index} className="star full-star"></span>;
                } else if (index === fullStars && hasHalfStar) {
                  return <span key={index} className="star half-star"></span>;
                } else {
                  return <span key={index} className="star empty-star"></span>;
                }
              })}
          </div>
          <p className="text-gray-500 mt-2">{totalReviews} reviews</p>

          <div className="space-y-6 ">
            {reviewedProducts.length > 0 ? (
              <ul className="space-y-4">
                {reviewedProducts.map((product) => (
                  <li
                    key={product.ID}
                    className="bg-white shadow p-4 rounded-lg border flex flex-col space-y-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-gray-900 font-medium">
                          {product.User?.UserName || "Anonymous"}
                        </h3>
                        <div className="text-yellow-400 flex space-x-1">
                          {Array(5)
                            .fill(null)
                            .map((_, index) => (
                              <span
                                key={index}
                                className={`${index < (product.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              >
                                ★
                              </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          {product.UpdatedAt
                            ? new Date(product.UpdatedAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "Unknown Date"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 mt-3">{product.content}</p>
                      <div className="flex space-x-2 mt-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt="Review Image"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleClick(product)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                      >
                        <Heart
                          className={`w-5 h-5 ${userLikes.has(product.ID)
                            ? "fill-red-500 text-red-500"
                            : "fill-none text-gray-500"
                            }`}
                        />
                        <span>{product.favorites_count ?? 0}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
