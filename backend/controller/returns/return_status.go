package returns

import (
   "net/http"
   "github.com/sut67/team17/config"
   "github.com/sut67/team17/entity"
   "github.com/gin-gonic/gin"
)

func GetReturnStatus(c *gin.Context) {
   var status []entity.ReturnStatus

   db := config.DB()
   db.Find(&status)
   c.JSON(http.StatusOK, &status)
}