package returns

import (
   "net/http"
   "github.com/sut67/team17/config"
   "github.com/sut67/team17/entity"
   "github.com/gin-gonic/gin"
)

func GetReturnReasons(c *gin.Context) {
   var reasons []entity.ReturnReason

   db := config.DB()
   db.Find(&reasons)
   c.JSON(http.StatusOK, &reasons)
}