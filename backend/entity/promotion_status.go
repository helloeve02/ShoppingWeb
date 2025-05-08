package entity

import "gorm.io/gorm"

type PromotionStatus struct {
	gorm.Model
	PromotionStatusName string   `json:"promotion_status_name"`
	Promotions          []Promotions  `gorm:"foreignKey:PromotionStatusID" json:"promotions"`
}