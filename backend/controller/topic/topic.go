package topics

import (

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

// GET /topics
func GetTopics(c *gin.Context) {
    var topics []entity.Topics
	db := config.DB()
    if err := db.Find(&topics).Error; err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, topics)
}

