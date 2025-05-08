package invoice

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
)

func GetInvoiceTypes(c *gin.Context) {
	var types []entity.InvoiceType

	db := config.DB()
	db.Find(&types)
	c.JSON(http.StatusOK, &types)
}
