package promotion_product

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
)

func GetAllPromotionProduct(c *gin.Context) {
	var promoPrduct []entity.PromotionProducts

	db := config.DB()

	result := db.Find(&promoPrduct)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, promoPrduct)
}