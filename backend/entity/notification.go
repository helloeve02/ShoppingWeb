package entity

import "gorm.io/gorm"

type Notifications struct {
	gorm.Model
	Content  string
	UserID	uint
	User    Users    `gorm:"foreignKey:UserID" valid:"-"`    // Skip validation
	NotificationTypeID uint
	NotificationType NotificationType	`gorm:"foreignKey:NotificationTypeID" valid:"-"`
}