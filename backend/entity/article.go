package entity

import (
	"gorm.io/gorm"
)

type Articles struct {
	gorm.Model
	Title 		string	`json:"title" valid:"required~Title is required"`
	Content		string	`json:"content" valid:"required~Content is required"`
	TopicID uint `json:"topic_id" valid:"required~TopicID is required"`
	Topic   Topics `gorm:"foreignKey:TopicID" valid:"-"`
	
}
