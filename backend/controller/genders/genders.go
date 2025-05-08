package genders


import (

   "net/http"


   "github.com/sut67/team17/config"

   "github.com/sut67/team17/entity"

   "github.com/gin-gonic/gin"

)


func GetAll(c *gin.Context) {


   db := config.DB()


   var genders []entity.Genders

   db.Find(&genders)


   c.JSON(http.StatusOK, &genders)


}