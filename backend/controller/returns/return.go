package returns

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

func CreateReturn(c *gin.Context) {
	var returns entity.Return

	// bind เข้าตัวแปร return
	if err := c.ShouldBindJSON(&returns); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ค้นหา types ด้วย id
	var types entity.ReturnType
	db.First(&types, returns.ReturnTypeID)
	if types.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "type not found"})
		return
	}

	// ค้นหา reasons ด้วย id
	var reasons entity.ReturnReason
	db.First(&reasons, returns.ReturnReasonID)
	if reasons.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "reason not found"})
		return
	}

	// สร้าง Return
	r := entity.Return{
		Description:    returns.Description,
		ProvingImage:   returns.ProvingImage,
		ReturnTypeID:   returns.ReturnTypeID,
		ReturnReasonID: returns.ReturnReasonID,
		ReturnStatusID: 1,
		OrderID:        returns.OrderID,
		UserID:         returns.UserID,
	}

	if err := db.Create(&r).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Submit return successfully!"})
}

func GetReturnRequest(c *gin.Context) {
	var returns []entity.Return

	db := config.DB()
	results := db.Preload("ReturnType").Preload("ReturnReason").Preload("ReturnStatus").Preload("Order").Preload("User").Where("return_status_id = ?", 1).Find(&returns)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, returns)
}

func GetReturnManaged(c *gin.Context) {
	var returns []entity.Return

	db := config.DB()
	results := db.Preload("ReturnType").Preload("ReturnReason").Preload("ReturnStatus").Preload("Order").Preload("User").Not("return_status_id = ?", 1).Order("updated_at DESC").Find(&returns)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, returns)
}

func GetReturnRefunded(c *gin.Context) {
	var returns []entity.Return
	userID := c.Param("id")

	db := config.DB()
	results := db.
		Preload("ReturnType").
		Preload("ReturnReason").
		Preload("ReturnStatus").
		Preload("User").
		Joins("JOIN order_items ON order_items.order_id = returns.order_id").
		Joins("JOIN products ON order_items.product_id = products.id").
		Where("returns.return_status_id = ? AND products.user_id = ?", 4, userID).
		Find(&returns)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, returns)
}

func GetReturnApproved(c *gin.Context) {
	var returns []entity.Return
	userID := c.Param("id")

	db := config.DB()
	results := db.
		Preload("ReturnType").
		Preload("ReturnReason").
		Preload("ReturnStatus").
		Preload("User").
		Joins("JOIN order_items ON order_items.order_id = returns.order_id").
		Joins("JOIN products ON order_items.product_id = products.id").
		Where("returns.return_status_id = ? AND products.user_id = ?", 2, userID).
		Find(&returns)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, returns)
}

func ApproveReturn(c *gin.Context) {
	var returns entity.Return
	returnsID := c.Param("id")

	db := config.DB()
	result := db.First(&returns, returnsID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Return ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&returns); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	returns.ReturnStatusID = 2
	result = db.Save(&returns)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Approve return failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Approve return successul!"})
}

func DenyReturn(c *gin.Context) {
	var returns entity.Return
	returnsID := c.Param("id")

	db := config.DB()
	result := db.First(&returns, returnsID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Return ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&returns); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	returns.ReturnStatusID = 3
	result = db.Save(&returns)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Deny return failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deny return successul!"})
}

func RefundReturn(c *gin.Context) {
	var returns entity.Return
	returnsID := c.Param("id")

	db := config.DB()
	result := db.First(&returns, returnsID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Return ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&returns); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	returns.ReturnStatusID = 4
	result = db.Save(&returns)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Deny return failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deny return successul!"})
}

func DeleteReturn(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	var returns entity.Return
	if err := db.First(&returns, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Return ID not found"})
		return
	}

	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed: "})
		}
	}()

	// Soft delete return
	if err := tx.Model(&returns).Update("deleted_at", time.Now()).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete return failed!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delete return successful!"})
}
