package entity

import (
	"gorm.io/gorm"
)

type ReturnReason struct {
	gorm.Model
	Name string

	Return	[]Return `gorm:"foreignKey:ReturnReasonID"`
}