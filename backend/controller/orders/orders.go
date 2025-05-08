package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

func GetOrderItemsByUserID(c *gin.Context) {
	var userID = c.Param("id")
	var orderItems []entity.OrderItems

	db := config.DB()
	results := db.Preload("Order.Return.ReturnStatus").Preload("Order.Return.ReturnType").Preload("Order.Return.ReturnReason").Preload("Order.Orderstatus").Preload("Order.Invoice.InvoiceType").Preload("Product.ProductImages").Where("user_id = ?", userID).Find(&orderItems)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, orderItems)
}

func RecievedOrder(c *gin.Context) {
	var order entity.Orders
	orderID := c.Param("id")

	db := config.DB()
	result := db.First(&order, orderID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	order.OrderstatusID = 4
	result = db.Save(&order)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recieved order failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Recieved order successul!"})
}

func ReturnOrder(c *gin.Context) {
	var order entity.Orders
	orderID := c.Param("id")

	db := config.DB()
	result := db.First(&order, orderID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	order.OrderstatusID = 6
	result = db.Save(&order)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Return order failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Return order successul!"})
}

func GetInvoiceByUserID(c *gin.Context) {
	userID := c.Param("id")
	var invoice entity.Invoice

	db := config.DB()
	results := db.Preload("InvoiceType").Where("user_id = ?", userID).First(&invoice)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if invoice.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, invoice)
}

func GetInvoiceByOrderID(c *gin.Context) {
	orderID := c.Param("id")
	var invoice entity.Invoice

	db := config.DB()
	results := db.Preload("InvoiceType").Where("order_id = ?", orderID).First(&invoice)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if invoice.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, invoice)
}

func UpdateWalletForSellerByID(c *gin.Context) {
	var wallet entity.Wallets
	ID := c.Param("id")
	db := config.DB()

	// Parse the total_price from the request
	totalPrice, err := strconv.Atoi(c.Param("totalPrice"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid totalPrice"})
		return
	}

	// Check if a wallet exists for the given user ID
	result := db.Where("user_id = ?", ID).First(&wallet)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Wallet not found"})
		return
	}

	// Update the wallet balance
	wallet.Balance += totalPrice

	// Save the updated wallet in the database
	result = db.Save(&wallet)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update wallet"})
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"message": "Wallet updated successfully",
		"wallet":  wallet,
	})
}

func GetShopNameByUserID(c *gin.Context) {
	userID := c.Param("id")
	var user entity.Users

	db := config.DB()
	results := db.Where("id = ?", userID).First(&user)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if user.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, user.StoreName)
}