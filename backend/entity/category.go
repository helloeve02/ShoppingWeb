package entity

import "gorm.io/gorm"

type Categories struct {
	gorm.Model
	CategoryName string     `json:"category_name" valid:"required~Category name is required"`
	CategoryPicture string  `json:"category_picture" valid:"required~Category picture is required"`

	Product      []Products `gorm:"foreignKey:CategoryID" json:"product"`
}
