package entity

import (
	"gorm.io/gorm"
)

type ReturnStatus struct {
	gorm.Model
	Name string

	Return	[]Return `gorm:"foreignKey:ReturnStatusID"`
}