package returns

import (
   "net/http"
   "github.com/sut67/team17/config"
   "github.com/sut67/team17/entity"
   "github.com/gin-gonic/gin"
)

func GetReturnTypes(c *gin.Context) {
   var types []entity.ReturnType

   db := config.DB()
   db.Find(&types)
   c.JSON(http.StatusOK, &types)
}