package product_images

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
)

func GetAllProductImage(c *gin.Context) {
	var image []entity.ProductImages

	db := config.DB()

	result := db.Find(&image)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, image)
}
