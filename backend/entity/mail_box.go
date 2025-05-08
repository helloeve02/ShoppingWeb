package entity

import (
	"time"

	"gorm.io/gorm"
)

type MailBox struct {
	gorm.Model
	Date 		time.Time `json:"date" valid:"required~Date is required"`
	AdminResponse 	string `json:"adminresponse" valid:"required~AdminResponse is required"`
	IsRead	bool	 `json:"is_read"` 
	UserID uint    `gorm:"foreignKey:UserID" valid:"required~UserID is required"`
	User   Users    `gorm:"foreignKey: UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user" valid:"-"`

	HelpCenterStatusID uint `json:"helpcenterstatus_id" valid:"required~HelpCenterStatusID is required"`
	HelpCenterStatus   HelpCenterStatus `gorm:"foreignKey:HelpCenterStatusID" valid:"-"`

	HelpCenterID uint `json:"helpcenter_id" valid:"required~HelpCenterID is required"`
	HelpCenter   HelpCenter `gorm:"foreignKey:HelpCenterID" valid:"-"`
}
