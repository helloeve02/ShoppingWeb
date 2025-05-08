package entity

import (
	"gorm.io/gorm"
)

type ReturnType struct {
	gorm.Model
	Name string

	Return	[]Return `gorm:"foreignKey:ReturnTypeID"`
}