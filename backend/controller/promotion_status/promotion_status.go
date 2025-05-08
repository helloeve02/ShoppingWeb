package promotion_status

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
)

func GetAllPromotionStatus(c *gin.Context) {
	var status []entity.PromotionStatus

	db := config.DB()

	result := db.Find(&status)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, status)
}
