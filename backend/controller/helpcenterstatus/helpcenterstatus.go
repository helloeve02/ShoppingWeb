package helpcenterstatus

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"

	"github.com/sut67/team17/entity"
)

func ListMailBoxStatus(c *gin.Context) {
    var statuses []entity.HelpCenterStatus
    if err := config.DB().Find(&statuses).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, statuses)
}
