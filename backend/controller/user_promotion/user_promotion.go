package user_promotion

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
)

func GetAllUserPromotion(c *gin.Context) {
	var uPromo []entity.UserPromotions

	db := config.DB()

	result := db.Find(&uPromo)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, uPromo)
}