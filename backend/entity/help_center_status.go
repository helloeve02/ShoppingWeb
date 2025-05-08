package entity

import (
	"gorm.io/gorm"
)

type HelpCenterStatus struct {
	gorm.Model
	Status 	string `json:"status" valid:"required~Status is required"`

	HelpCenters []HelpCenter `gorm:"foreignKey:HelpCenterStatusID"`
	
}