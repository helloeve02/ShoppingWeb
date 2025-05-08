package entity

import (
	"gorm.io/gorm"
)

type Topics struct {
	gorm.Model
	Topic 		string	`json:"topic" valid:"required~Topic is required"`

	HelpCenters []HelpCenter `gorm:"foreignKey:TopicID"`
	Article []Articles `gorm:"foreignKey:TopicID"`
}
