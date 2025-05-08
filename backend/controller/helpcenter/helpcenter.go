package helpcenter

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

func CreateHelpCenterFrom(c *gin.Context) {
	var helpcenter entity.HelpCenter
	var mailbox entity.MailBox
	
	if err := c.ShouldBindJSON(&helpcenter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	db := config.DB()

	if helpcenter.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required and cannot be empty"})
		return
	}

	var user entity.Users
	if err := db.First(&user, helpcenter.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if helpcenter.TopicID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "topic_id is required and cannot be empty"})
		return
	}

	var topic entity.Topics
	if err := db.First(&topic, helpcenter.TopicID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Topic not found"})
		return
	}

	var helpcenterstatus entity.HelpCenterStatus
	if err := db.First(&helpcenterstatus, 1).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "HelpCenterStatus not found"})
		return
	}
	helpcenter.HelpCenterStatusID = helpcenterstatus.ID

	if err := db.Create(&helpcenter).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create HelpCenter", "details": err.Error()})
		return
	}

	mailbox = entity.MailBox{
		Date:               helpcenter.CreatedAt, 
		AdminResponse:      "Please wait for a response from the admin.",
		HelpCenterStatusID: helpcenter.HelpCenterStatusID,              
		HelpCenterID:       helpcenter.ID,  
		UserID:             helpcenter.UserID,
	}

	if err := db.Create(&mailbox).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create MailBox", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "HelpCenter and MailBox created successfully",
		"helpcenter": helpcenter,
		"mailbox":    mailbox,
	})
}

func ListHelpCenterFrom(c *gin.Context) {
	var helpCenters []entity.HelpCenter

	db := config.DB()

	fmt.Println("Fetching HelpCenter data...")

	if err := db.Preload("Topic").Preload("HelpCenterStatus").Preload("User").Find(&helpCenters).Error; err != nil {
		fmt.Println("Error fetching data:", err)
		
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Data fetched successfully:", helpCenters)
	c.JSON(http.StatusOK, helpCenters)
}




