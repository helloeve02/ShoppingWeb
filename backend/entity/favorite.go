package entity

import (

	"gorm.io/gorm"
)

type Favorites struct {
	gorm.Model

	ReviewID uint
	Review   Reviews `gorm:"foreignKey:ReviewID"`

	UserID uint
	User   Users `gorm:"foreignKey:UserID"`
}
