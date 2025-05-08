package notification

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
)

func GetNotification(c *gin.Context) {
	var promotions []entity.Promotions

	db := config.DB()

	if err := db.Find(&promotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch promotions"})
		return
	}

	c.JSON(http.StatusOK, promotions)
}

func GetOrderByID(c *gin.Context) {
	// รับค่า userID จากพารามิเตอร์ใน URL
	userID := c.Param("id")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var order []entity.Orders

	// Get the database connection
	db := config.DB()

	// Query with joins to get payment details filtered by userID
	err := db.Preload("Users").Preload("Orderstatus").Preload("Wallets").Preload("Shipping").
		Where("user_id = ?", userID).Find(&order).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch order details"})
		return
	}

	// Return the fetched payments as a JSON response
	c.JSON(http.StatusOK, gin.H{"order": order})
}