package entity

import (
	"time"

	"gorm.io/gorm"
)

type HelpCenter struct {
	gorm.Model
	Date 		time.Time `json:"date" valid:"required~Date is required"`
	Subject 	string `json:"subject" valid:"required~Subject is required"`
	Description 	string `json:"description" valid:"required~Description is required"`
	Image 		string `json:"image" valid:"required~Image is required"`

	UserID uint `json:"user_id" valid:"required~UserID is required"`
	User   Users `gorm:"foreignKey:UserID" valid:"-"`

	TopicID uint `json:"topic_id" valid:"required~TopicID is required"`
	Topic   Topics `gorm:"foreignKey:TopicID" valid:"-"`

	HelpCenterStatusID uint `json:"helpcenterstatus_id" valid:"required~HelpCenterStatusID is required"`
	HelpCenterStatus   HelpCenterStatus `gorm:"foreignKey:HelpCenterStatusID" valid:"-"`

	MailBoxs []MailBox `gorm:"foreignKey:HelpCenterID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}