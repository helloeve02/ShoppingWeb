package review

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"gorm.io/gorm"
)
func CreateReview(c *gin.Context) {
	var inputReview entity.Reviews
	db := config.DB()

	if err := c.ShouldBindJSON(&inputReview); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input", "details": err.Error()})
		return
	}
    fmt.Println("inputReview.orderitems_id: ",inputReview.OrderItemsID)

	var orderItem entity.OrderItems
	if err := db.Preload("Order.Orderstatus").
		Where("id = ?", inputReview.OrderItemsID).
		First(&orderItem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order item not found or invalid"})
		return
	}
	
	fmt.Println("Orderstatus",orderItem.Order.OrderstatusID)

	if orderItem.Order.OrderstatusID != 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot review order item that is not completed"})
		return
	}

	var existingReview entity.Reviews
	if err := db.Where("order_items_id = ? AND user_id = ?", inputReview.OrderItemsID, inputReview.UserID).
		First(&existingReview).Error; err == nil {
		
		existingReview.Rating = inputReview.Rating
		existingReview.Content = inputReview.Content
		existingReview.Image = inputReview.Image
		existingReview.CreateDate = time.Now().Local()

		if err := db.Save(&existingReview).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update review", "details": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Review updated successfully", "review_id": existingReview.ID})
		return
	}

	newReview := entity.Reviews{
		OrderItemsID: inputReview.OrderItemsID,
		ProductID:    orderItem.ProductID,
		UserID:       inputReview.UserID,
		Rating:       inputReview.Rating,
		Content:      inputReview.Content,
		Image:        inputReview.Image,
		CreateDate:   time.Now().Local(),
	}

	if err := db.Create(&newReview).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review created successfully", "review_id": newReview.ID})
}

func ListOrderItemsNoReview(c *gin.Context) {
    var userID = c.Param("id")
    var orderItems []entity.OrderItems

    db := config.DB()
    
    results := db.
        Joins("LEFT JOIN reviews ON order_items.id = reviews.order_items_id").
        Joins("LEFT JOIN orders ON order_items.order_id = orders.id"). // เพิ่ม JOIN กับตาราง orders
        Where("reviews.id IS NULL").
        Where("order_items.user_id = ?", userID).
        Where("orders.orderstatus_id = ?", "4").
        Preload("Order").
        Preload("User").
        Preload("Order.Orderstatus").
        Preload("Product").
        Preload("Product.ProductImages").
        Find(&orderItems)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, orderItems)
}

// สำหรับดูรีวิวของผู้ใช้คนเดียว
func ListUserReviews(c *gin.Context) {
    var reviews []entity.Reviews
    userID := c.Param("id")
    db := config.DB()

    if err := db.Preload("OrderItems").
        Preload("OrderItems.Order").
        Preload("OrderItems.Product").
        Preload("OrderItems.Product.ProductImages").
        Preload("OrderItems.User").
        Preload("Product").
        Preload("User").
        Where("user_id = ?", userID).
        Order("create_date DESC").
        Find(&reviews).Error; err != nil {
        fmt.Println("Error fetching data:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, reviews)
}

// สำหรับดูรีวิวทั้งหมดของสินค้า
func ListReviewProducts(c *gin.Context) {
    productId := c.Param("productId")
    if productId == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "productId is required"})
        return
    }
    
    var reviews []entity.Reviews
    db := config.DB()

    if err := db.Preload("OrderItems").
        Preload("OrderItems.Order").
        Preload("OrderItems.Product").
        Preload("OrderItems.Product.ProductImages").
        Preload("Product").
        Preload("User").
        Preload("Favorites").
        Preload("Favorites.User").
        Where("product_id = ?", productId).
        Order("create_date DESC").
        Find(&reviews).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, reviews)
}


func FavoriteToggle(c *gin.Context) {
    var review entity.Reviews
    var favorite entity.Favorites

    productID := c.Param("product_id")
    reviewID := c.Param("review_id")
    userIDStr := c.Param("user_id")
    action := c.Param("action") // favorite หรือ unfavorite

    if productID == "" || reviewID == "" || userIDStr == "" || action == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "product_id, review_id, user_id, or action cannot be empty"})
        return
    }

    userID, err := strconv.ParseUint(userIDStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user_id"})
        return
    }

    db := config.DB()

    if err := db.First(&review, "id = ? AND product_id = ?", reviewID, productID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
        return
    }

    // ตรวจสอบว่า user นี้เคยกดไลค์รีวิวนี้แล้วหรือยัง
    if err := db.First(&favorite, "review_id = ? AND user_id = ?", reviewID, uint(userID)).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            if action == "favorite" {
                newFavorite := entity.Favorites{ReviewID: review.ID, UserID: uint(userID)}
                db.Create(&newFavorite)
                review.FavoritesCount++
                db.Save(&review)
            }
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
            return
        }
    } else {
        if action == "unfavorite" {
            db.Delete(&favorite)
            if review.FavoritesCount > 0 {
                review.FavoritesCount--
            }
            db.Save(&review)
        }
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "favorites_count": review.FavoritesCount})
}







