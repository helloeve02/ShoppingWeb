package mailbox

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

	func ResponseMailBox(c *gin.Context) {
		var req struct {
			MessageId uint   `json:"messageId"`
			Response  string `json:"response"`
			StatusID    uint `json:"helpcenterstatus_id"`
		}
		fmt.Println(req.StatusID)
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		fmt.Println("Received Request:", req)

		var mailbox entity.MailBox
		if err := config.DB().First(&mailbox, req.MessageId).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "MailBox not found"})
			return
		}
		
		fmt.Println("Received StatusID:", req.StatusID) 
		mailbox.HelpCenterStatusID = req.StatusID
		
		mailbox.AdminResponse = req.Response
		mailbox.HelpCenterStatusID = req.StatusID

		if err := config.DB().Save(&mailbox).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update MailBox"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Response and status updated successfully",
			"updated_mailbox": mailbox,
		})
	}

func ListMailBox(c *gin.Context) {
    var mailboxes []entity.MailBox

    db := config.DB()

    fmt.Println("Fetching mailbox data...")

    if err := db.Preload("HelpCenter").Preload("HelpCenterStatus").Preload("User").Preload("HelpCenter.Topic").Preload("HelpCenter.User").Find(&mailboxes).Error; err != nil {
        fmt.Println("Error fetching data:", err)

        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    fmt.Println("Data fetched successfully:", mailboxes)
    c.JSON(http.StatusOK, mailboxes)
}

func UpdateReadStatus(c *gin.Context) {
    var mailbox entity.MailBox
	var status entity.HelpCenterStatus

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	
    db := config.DB()
    if err := db.Where("id = ?", id).First(&mailbox).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
        return
    }

    if err := db.Where("id = ?", mailbox.HelpCenterStatusID).First(&status).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve status"})
        return
    }

    if status.Status != "Success" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot mark as read while status is not complete"})
        return
    }

    mailbox.IsRead = true
    if err := db.Save(&mailbox).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update read status"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Message marked as read"})
}
