package entity

import "gorm.io/gorm"

type Brands struct {
	gorm.Model
	BrandName 	string		`json:"brand_name"`
	Product 	[]Products	`gorm:"foreignKey:BrandID"`
}