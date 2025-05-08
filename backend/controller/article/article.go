package articles

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)
func Createarticles(c *gin.Context) {
    var article entity.Articles
	var topic entity.Topics
    db := config.DB()

    if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
		return
	}
	
	if article.TopicID == 0 { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "TopicID is required and cannot be empty"})
		return
	}

    if err := db.First(&topic, article.TopicID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Topic not found"})
        return
    }

	if err := db.Create(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Article", "details": err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Article created successfully"})
}

func ListArticles(c *gin.Context) {
	var articles []entity.Articles

	db := config.DB()

	db.Find(&articles)

	c.JSON(http.StatusOK, &articles)
}

func GetArticles(c *gin.Context) {
    var articles []entity.Articles
	db := config.DB()
    if err := db.Find(&articles).Error; err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, articles)
}

func UpdateArticle(c *gin.Context) {
    var article entity.Articles
    var existingArticle entity.Articles
    db := config.DB()

    id := c.Param("id")

    if err := db.First(&existingArticle, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
        return
    }

    if err := c.ShouldBindJSON(&article); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data", "details": err.Error()})
        return
    }

    existingArticle.Title = article.Title
    existingArticle.Content = article.Content
    existingArticle.TopicID = article.TopicID

    var topic entity.Topics
    if err := db.First(&topic, article.TopicID).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid TopicID"})
        return
    }

    if err := db.Save(&existingArticle).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Article", "details": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Article updated successfully"})
}

func DeleteArticle(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()
  
    if tx := db.Exec("DELETE FROM articles WHERE id = ?", id); tx.RowsAffected == 0 {
      c.JSON(http.StatusBadRequest, gin.H{"error": "Article not found"})
      return
    }
  
    c.JSON(http.StatusOK, gin.H{"message": "Article deleted successfully"})
  }
  